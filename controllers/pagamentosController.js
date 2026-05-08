import path from 'path';
import { google } from 'googleapis';
import User from '../models/UserModel.js';

export const verificarPagamento = async (req, res) => {
  const { purchaseToken, productId } = req.body;
  const userId = req.user.id;

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), 'google-service-account.json'),
      scopes: ['https://www.googleapis.com/auth/androidpublisher'],
    });

    const androidPublisher = google.androidpublisher({
      version: 'v3',
      auth,
    });

    const response = await androidPublisher.purchases.products.get({
      packageName: 'com.apolotecnologia.assistenteprofessor',
      productId: productId,
      token: purchaseToken,
    });

    if (response.data.purchaseState === 0) {
      await User.findByIdAndUpdate(userId, {
        isPremium: true,
        purchaseToken: purchaseToken,
        productId: productId,
        dataPagamento: new Date()
      });

      await androidPublisher.purchases.products.acknowledge({
        packageName: 'com.apolotecnologia.assistenteprofessor',
        productId: productId,
        token: purchaseToken,
      });
      console.log("✅ Compra confirmada no Google com sucesso!");

      return res.status(200).json({
        status: 'sucesso',
        message: "Acesso Premium liberado com sucesso!"
      });
    }

    return res.status(400).json({ success: false, message: "Pagamento não aprovado." });

  } catch (error) {
    console.error("❌ Erro IAP Google:", error.response ? error.response.data : error.message);
    return res.status(500).json({ error: "Erro ao processar validação de compra." });
  }
};