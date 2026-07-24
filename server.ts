import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { authenticateToken } from "./src/lib/auth-middleware";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.set('trust proxy', true);

  app.use(express.json());

  // In-memory mock user store
  const users: any[] = [];

  app.post("/api/auth/register", async (req, res) => {
    try {
      const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      
      const ipCount = users.filter(u => u.ip === clientIp).length;
      if (ipCount >= 2) {
        return res.status(403).json({ error: "Limite de création de compte atteinte pour cette adresse IP (maximum 2)." });
      }

      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      users.push({ email, password: hashedPassword, ip: clientIp });
      res.json({ message: "Utilisateur enregistré" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'enregistrement" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = users.find(u => u.email === email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Identifiants invalides" });
      }
      const token = jwt.sign({ email }, process.env.JWT_SECRET || "default_secret", { expiresIn: "1h" });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la connexion" });
    }
  });

  app.get("/api/auth/me", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Non autorisé" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        res.json({ email: (decoded as any).email });
    } catch (error) {
        res.status(401).json({ error: "Token invalide" });
    }
  });

  const getGenAI = () => {
    let apiKey = (process.env.GEMINI_API_KEY || "").trim().replace(/^["']|["']$/g, '');
    if (apiKey === "undefined" || apiKey === "null") apiKey = "";
    
    if (!apiKey) {
      throw new Error("SERVEUR_API_KEY_MANQUANTE");
    }
    return new GoogleGenAI({ apiKey });
  };

  app.post("/api/generate", authenticateToken, async (req, res) => {
    try {
      const genAI = getGenAI();
      const { baseIdea, systemInstruction, modelName, temperature } = req.body;
      
      const response = await genAI.models.generateContent({
        model: modelName || "gemini-3-flash-preview",
        contents: `Transforme cette idée en un prompt professionnel : "${baseIdea}"`,
        config: {
          systemInstruction: systemInstruction,
          temperature: temperature !== undefined ? parseFloat(temperature) : 0.7
        }
      });
      
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Erreur serveur generation:", error);
      res.status(500).json({ error: error.message || "Erreur lors de la génération." });
    }
  });

  app.post("/api/refine", authenticateToken, async (req, res) => {
    try {
      const genAI = getGenAI();
      const { currentPrompt, feedback, systemInstruction, modelName, temperature } = req.body;
      
      const response = await genAI.models.generateContent({
        model: modelName || "gemini-3-flash-preview",
        contents: `Prompt actuel : "${currentPrompt}"\n\nRetours de l'utilisateur : "${feedback}"`,
        config: {
          systemInstruction: systemInstruction,
          temperature: temperature !== undefined ? parseFloat(temperature) : 0.5
        }
      });
      
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Erreur serveur affinage:", error);
      res.status(500).json({ error: error.message || "Erreur lors de l'affinage." });
    }
  });

  // Test route 
  app.get("/api/health", (req, res) => {
     let apiKey = (process.env.GEMINI_API_KEY || "").trim().replace(/^["']|["']$/g, '');
     res.json({ 
       status: "ok", 
       keyLength: apiKey.length,
       hasKey: apiKey.length > 0 && apiKey !== "undefined"
     });
  });

  // SebPay integration
  app.post("/api/sebpay/collect", async (req, res) => {
    try {
      const publicKey = process.env.SEBPAY_PUBLIC_KEY;
      const secretKey = process.env.SEBPAY_SECRET_KEY;

      if (!publicKey || !secretKey) {
        return res.status(500).json({ success: false, message: "Les clés SebPay ne sont pas configurées sur le serveur." });
      }

      const response = await fetch("https://newapi.sebpay.bj/api/v1/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Public-Key": publicKey,
          "X-Secret-Key": secretKey
        },
        body: JSON.stringify(req.body)
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error: any) {
      console.error("Erreur serveur SebPay collect:", error);
      res.status(500).json({ success: false, message: error.message || "Erreur interne" });
    }
  });

  app.get("/api/sebpay/collect/:id", async (req, res) => {
    try {
      const publicKey = process.env.SEBPAY_PUBLIC_KEY;
      const secretKey = process.env.SEBPAY_SECRET_KEY;

      if (!publicKey || !secretKey) {
        return res.status(500).json({ success: false, message: "Les clés SebPay ne sont pas configurées sur le serveur." });
      }

      const response = await fetch(`https://newapi.sebpay.bj/api/v1/collections/${req.params.id}`, {
        method: "GET",
        headers: {
          "X-Public-Key": publicKey,
          "X-Secret-Key": secretKey
        }
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error: any) {
      console.error("Erreur serveur SebPay status:", error);
      res.status(500).json({ success: false, message: error.message || "Erreur interne" });
    }
  });

  app.get("/api/sebpay/operators", async (req, res) => {
    try {
      const publicKey = process.env.SEBPAY_PUBLIC_KEY;
      const secretKey = process.env.SEBPAY_SECRET_KEY;

      if (!publicKey || !secretKey) {
        return res.status(500).json({ success: false, message: "Les clés SebPay ne sont pas configurées sur le serveur." });
      }

      let url = "https://newapi.sebpay.bj/api/v1/operators";
      if (req.query.country) {
        url += `?country=${req.query.country}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-Public-Key": publicKey,
          "X-Secret-Key": secretKey
        }
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error: any) {
      console.error("Erreur serveur SebPay operators:", error);
      res.status(500).json({ success: false, message: error.message || "Erreur interne" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serveur sécurisé opérationnel sur le port ${PORT}`);
  });
}

startServer();
