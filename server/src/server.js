import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";
import cors from "cors";
import { testConnection }  from './models/testConnection.js';
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middlewares/authMiddleware.js";


const app = express();
const PORT = 5000;
const PORT_CLIENT = 3000;
// Middleware parse JSON
app.use(express.json());
dotenv.config();
app.use(cookieParser());// để đọc cookie



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: [`http://localhost:${PORT_CLIENT}`], // cho phép React client
    credentials: true, // cho phép gửi cookie, header Authorization...
  })
);

// Routes
app.use("/api/auth",authRoutes);
 
app.use(morgan('combined'))

// Cấu hình template engine Handlebars
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
console.log(__dirname);
app.set("views", path.join(__dirname, "resources/views"));


app.get('/', (req, res) => {
  res.render('home');
});


app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await testConnection();
    res.json({ message: 'Database connected!', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.get('/news', (req, res) => {//(request,response) khi truy cập vào web nó sẽ gửi 1 yêu cầu lên sever thì biến request này nó sẽ chứ cái thông tin
  //ứng dụng gửi lên sever
  //biến respones là biến trả về 
  console.log(req);
  res.render('news');
})

app.use('/images', express.static(path.join(__dirname, 'public/images')));
//dẫn đến file static


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
