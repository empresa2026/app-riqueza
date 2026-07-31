import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import firebaseConfig from "./firebase-applet-config.json" assert { type: "json" };

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory store for webhook logs (synchronized with client via API)
interface WebhookLog {
  id: string;
  provider: 'kiwify' | 'hotmart';
  event: string;
  buyerEmail: string;
  buyerName: string;
  productName: string;
  status: 'paid' | 'approved' | 'refunded' | 'canceled' | 'unknown';
  actionTaken: 'grant_access' | 'revoke_access' | 'ignored';
  timestamp: string;
  rawPayload: any;
  success: boolean;
  message: string;
}

const webhookLogs: WebhookLog[] = [
  {
    id: 'log-demo-1',
    provider: 'kiwify',
    event: 'order_approved',
    buyerEmail: 'aluno.demo@exemplo.com',
    buyerName: 'Carlos Eduardo',
    productName: 'Protocolo 5 Alianças Familiares',
    status: 'paid',
    actionTaken: 'grant_access',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    rawPayload: {
      order_id: "KW-89231",
      order_status: "paid",
      Product: { product_name: "Protocolo 5 Alianças Familiares" },
      Customer: { full_name: "Carlos Eduardo", email: "aluno.demo@exemplo.com" }
    },
    success: true,
    message: "Acesso liberado e conta criada para aluno.demo@exemplo.com"
  }
];

// Helper to provision or update user access via Firestore REST API
async function syncUserAccessInFirestore(userAccessData: {
  email: string;
  name: string;
  hasAccess: boolean;
  productName: string;
  provider: string;
  transactionId: string;
}) {
  try {
    const firestoreDbId = firebaseConfig.firestoreDatabaseId;
    const projectId = firebaseConfig.projectId;

    // Use Firestore REST API to save/update user status
    // Document ID based on safe email hash/encoding
    const docId = userAccessData.email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDbId}/documents/webhook_users/${docId}`;

    const documentFields = {
      fields: {
        email: { stringValue: userAccessData.email },
        displayName: { stringValue: userAccessData.name || userAccessData.email.split('@')[0] },
        hasAccess: { booleanValue: userAccessData.hasAccess },
        status: { stringValue: userAccessData.hasAccess ? 'ativo' : 'revogado' },
        productName: { stringValue: userAccessData.productName },
        provider: { stringValue: userAccessData.provider },
        transactionId: { stringValue: userAccessData.transactionId },
        updatedAt: { stringValue: new Date().toISOString() },
        role: { stringValue: 'user' }
      }
    };

    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(documentFields)
    });

    if (!response.ok) {
      console.warn("Firestore REST update warning:", await response.text());
    } else {
      console.log(`Firestore user ${docId} access set to ${userAccessData.hasAccess}`);
    }
  } catch (err) {
    console.error("Error in syncUserAccessInFirestore:", err);
  }
}

// ---------------------------------------------------------
// API ROUTES
// ---------------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// GET /api/webhooks/logs - Returns all received webhook logs
app.get("/api/webhooks/logs", (req, res) => {
  res.json({
    success: true,
    logs: webhookLogs,
    config: {
      kiwifyUrl: `${process.env.APP_URL || 'http://localhost:3000'}/api/webhooks/kiwify`,
      hotmartUrl: `${process.env.APP_URL || 'http://localhost:3000'}/api/webhooks/hotmart`,
      hotmartHottokConfigured: !!process.env.HOTMART_HOTTOK,
      kiwifySecretConfigured: !!process.env.KIWIFY_WEBHOOK_SECRET
    }
  });
});

// POST /api/webhooks/kiwify - Receives Kiwify Webhooks
app.post("/api/webhooks/kiwify", async (req, res) => {
  try {
    const payload = req.body || {};
    console.log("--> Kiwify Webhook received:", JSON.stringify(payload, null, 2));

    const orderStatus = (payload.order_status || payload.status || 'unknown').toLowerCase();
    const customer = payload.Customer || payload.customer || {};
    const product = payload.Product || payload.product || {};

    const buyerEmail = customer.email || payload.email || 'desconhecido@kiwify.com';
    const buyerName = customer.full_name || customer.name || buyerEmail.split('@')[0];
    const productName = product.product_name || product.name || 'Produto Kiwify';
    const transactionId = payload.order_id || payload.id || `KW-${Date.now()}`;

    let actionTaken: 'grant_access' | 'revoke_access' | 'ignored' = 'ignored';
    let message = '';
    let hasAccess = false;

    if (['paid', 'approved', 'complete'].includes(orderStatus)) {
      actionTaken = 'grant_access';
      hasAccess = true;
      message = `Acesso liberado com sucesso para ${buyerEmail} (${productName})`;
    } else if (['refunded', 'chargedback', 'canceled', 'refund'].includes(orderStatus)) {
      actionTaken = 'revoke_access';
      hasAccess = false;
      message = `Acesso revogado para ${buyerEmail} devido a estorno/cancelamento (${orderStatus})`;
    } else {
      message = `Evento recebido com status '${orderStatus}'. Nenhuma alteração efetuada.`;
    }

    if (actionTaken !== 'ignored') {
      await syncUserAccessInFirestore({
        email: buyerEmail,
        name: buyerName,
        hasAccess,
        productName,
        provider: 'kiwify',
        transactionId
      });
    }

    const logEntry: WebhookLog = {
      id: `log-kw-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      provider: 'kiwify',
      event: `order_${orderStatus}`,
      buyerEmail,
      buyerName,
      productName,
      status: orderStatus as any,
      actionTaken,
      timestamp: new Date().toISOString(),
      rawPayload: payload,
      success: true,
      message
    };

    webhookLogs.unshift(logEntry);
    if (webhookLogs.length > 50) webhookLogs.pop();

    return res.status(200).json({
      success: true,
      message,
      actionTaken,
      buyerEmail
    });
  } catch (error: any) {
    console.error("Error processing Kiwify Webhook:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/webhooks/hotmart - Receives Hotmart Webhooks
app.post("/api/webhooks/hotmart", async (req, res) => {
  try {
    const payload = req.body || {};
    console.log("--> Hotmart Webhook received:", JSON.stringify(payload, null, 2));

    // Hotmart Hottok validation check if env var set
    const hottok = req.headers['x-hotmart-hottok'] || payload.hottok;
    const expectedHottok = process.env.HOTMART_HOTTOK;

    if (expectedHottok && hottok !== expectedHottok) {
      console.warn("Hotmart Hottok invalid!");
      return res.status(401).json({ success: false, message: "Hottok de segurança inválido" });
    }

    const event = (payload.event || payload.status || 'UNKNOWN').toUpperCase();
    const data = payload.data || payload;
    const buyer = data.buyer || payload.buyer || {};
    const product = data.product || payload.product || {};
    const purchase = data.purchase || payload.purchase || {};

    const buyerEmail = buyer.email || 'desconhecido@hotmart.com';
    const buyerName = buyer.name || buyerEmail.split('@')[0];
    const productName = product.name || 'Curso Hotmart';
    const transactionId = purchase.transaction || `HT-${Date.now()}`;

    let actionTaken: 'grant_access' | 'revoke_access' | 'ignored' = 'ignored';
    let message = '';
    let hasAccess = false;

    if (['PURCHASE_APPROVED', 'APPROVED', 'COMPLETE'].includes(event)) {
      actionTaken = 'grant_access';
      hasAccess = true;
      message = `Acesso Hotmart liberado para ${buyerEmail} (${productName})`;
    } else if (['PURCHASE_REFUNDED', 'PURCHASE_CANCELED', 'REFUND', 'CHARGEDBACK', 'CANCELED'].includes(event)) {
      actionTaken = 'revoke_access';
      hasAccess = false;
      message = `Acesso Hotmart revogado para ${buyerEmail} devido a ${event}`;
    } else {
      message = `Evento Hotmart '${event}' recebido. Sem alteração de permissão.`;
    }

    if (actionTaken !== 'ignored') {
      await syncUserAccessInFirestore({
        email: buyerEmail,
        name: buyerName,
        hasAccess,
        productName,
        provider: 'hotmart',
        transactionId
      });
    }

    const logEntry: WebhookLog = {
      id: `log-ht-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      provider: 'hotmart',
      event: event.toLowerCase(),
      buyerEmail,
      buyerName,
      productName,
      status: hasAccess ? 'approved' : 'refunded',
      actionTaken,
      timestamp: new Date().toISOString(),
      rawPayload: payload,
      success: true,
      message
    };

    webhookLogs.unshift(logEntry);
    if (webhookLogs.length > 50) webhookLogs.pop();

    return res.status(200).json({
      success: true,
      message,
      actionTaken,
      buyerEmail
    });
  } catch (error: any) {
    console.error("Error processing Hotmart Webhook:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/webhooks/test-trigger - Simulator for Testing Webhooks from Admin UI
app.post("/api/webhooks/test-trigger", async (req, res) => {
  const { provider, eventType, buyerName, buyerEmail, productName } = req.body;

  if (provider === 'kiwify') {
    const mockKiwifyPayload = {
      order_id: `KW-TEST-${Math.floor(Math.random() * 100000)}`,
      order_status: eventType === 'approved' ? 'paid' : 'refunded',
      Customer: {
        full_name: buyerName || 'Aluno Teste Kiwify',
        email: buyerEmail || 'teste.kiwify@exemplo.com',
        mobile: '11999998888'
      },
      Product: {
        product_id: 'prod_mabi_5aliancas',
        product_name: productName || '5 Alianças Familiares'
      },
      Commissions: { charge_amount: '197.00' }
    };

    const response = await fetch(`http://localhost:${PORT}/api/webhooks/kiwify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockKiwifyPayload)
    });
    const result = await response.json();
    return res.json(result);
  } else {
    const mockHotmartPayload = {
      event: eventType === 'approved' ? 'PURCHASE_APPROVED' : 'PURCHASE_REFUNDED',
      hottok: process.env.HOTMART_HOTTOK || 'hottok_teste_123',
      data: {
        buyer: {
          name: buyerName || 'Aluno Teste Hotmart',
          email: buyerEmail || 'teste.hotmart@exemplo.com'
        },
        product: {
          id: 998231,
          name: productName || '5 Alianças Familiares'
        },
        purchase: {
          transaction: `HP-TEST-${Math.floor(Math.random() * 100000)}`,
          status: eventType === 'approved' ? 'APPROVED' : 'REFUNDED'
        }
      }
    };

    const response = await fetch(`http://localhost:${PORT}/api/webhooks/hotmart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockHotmartPayload)
    });
    const result = await response.json();
    return res.json(result);
  }
});

// ---------------------------------------------------------
// VITE MIDDLEWARE SETUP
// ---------------------------------------------------------

async function startServer() {
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
    console.log(`🚀 Webhook Server running on http://0.0.0.0:${PORT}`);
    console.log(`📌 Kiwify Endpoint: /api/webhooks/kiwify`);
    console.log(`📌 Hotmart Endpoint: /api/webhooks/hotmart`);
  });
}

startServer();
