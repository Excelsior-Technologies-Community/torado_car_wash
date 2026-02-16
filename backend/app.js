import express from "express";
import authRoute from "./routes/authRoute.js";
import profileRoute from "./routes/profileRoute.js";
import serviceRoute from "./routes/serviceRoute.js";
import servicePricingRoute from "./routes/servicePricingRoute.js";
import washTypeRoute from "./routes/washTypeRoute.js";
import washPackageRoute from "./routes/washPackageRoute.js";
import vehicleCategoryRoute from "./routes/vehicleCategoryRoute.js";
import bookingRoute from "./routes/bookingRoute.js";
import blogRoute from "./routes/blogRoute.js";
import blogCategoryRoute from "./routes/blogCategoryRoute.js";
import tagRoute from "./routes/tagRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
import wishlistRoute from "./routes/wishlistRoute.js";
import orderRoute from "./routes/orderRoute.js";
import teamRoute from "./routes/teamRoute.js";
import faqCategoryRoute from "./routes/faqCategoryRoute.js";
import faqRoute from "./routes/faqRoute.js";
import contactRoute from "./routes/contactRoute.js";
import testimonialRoute from "./routes/testimonialRoute.js";
import newsletterRoute from "./routes/newsletterRoute.js";
import contentRoute from "./routes/contentRoute.js";

import cors from "cors";

const app = express();

// Configure CORS with specific origins
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({ status: "Backend Running !!" });
});

//userRoutes
app.use("/api/users", authRoute);
app.use("/api/users", profileRoute);

//service routes
app.use("/api/services", serviceRoute);

app.use("/api/service-pricing", servicePricingRoute);

app.use("/api/wash-types", washTypeRoute);

app.use("/api/wash-packages", washPackageRoute);

app.use("/api/vehicle-categories", vehicleCategoryRoute);

//booking routes
app.use("/api/bookings", bookingRoute);

//product routea
app.use("/api/products", productRoute);

//blog routes
app.use("/api/blogs", blogRoute);
app.use("/api/blog-categories", blogCategoryRoute);
app.use("/api/tags", tagRoute);

//cart and wishlist routes
app.use("/api/cart", cartRoute);
app.use("/api/wishlist", wishlistRoute);

//order routes
app.use("/api/orders", orderRoute);

//team routes
app.use("/api/team", teamRoute);

//faq routes
app.use("/api/faq-categories", faqCategoryRoute);
app.use("/api/faqs", faqRoute);

//contact routes
app.use("/api/contact", contactRoute);

//testimonial routes
app.use("/api/testimonials", testimonialRoute);

//newsletter routes
app.use("/api/newsletter", newsletterRoute);

//content routes
app.use("/api/content", contentRoute);

export default app;
