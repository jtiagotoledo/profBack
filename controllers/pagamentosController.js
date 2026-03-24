import { google } from 'googleapis';
import User from '../models/UserModel'; 

export const verificarPagamento = async (req, res) => {
  const { purchaseToken, productId } = req.body;
  const userId = req.user.id; 

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: './google-service-account.json', 
      scopes: ['https://www.googleapis.com/auth/androidpublisher'],
    });

    const androidPublisher = google.androidpublisher({
      version: 'v3',
      auth,
    });

    const response = await androidPublisher.purchases.products.get({
      packageName: 'com.assistenteprofessor', 
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

      return res.status(200).json({ 
        success: true, 
        message: "Acesso Premium liberado com sucesso!" 
      });
    }

    return res.status(400).json({ success: false, message: "Pagamento não aprovado." });

  } catch (error) {
    console.error("Erro na validação do Google:", error);
    return res.status(500).json({ error: "Erro ao processar validação de compra." });
  }
};