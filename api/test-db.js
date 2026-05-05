import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log("Connected");
    try {
        const { default: PaymentAccount } = await import('./src/models/PaymentAccount.js');
        const count = await PaymentAccount.countDocuments({});
        console.log("Count:", count);
        
        // Try creating a fake one
        await PaymentAccount.create({
            userId: new mongoose.Types.ObjectId(),
            accountName: 'Test',
            type: 'bank'
        });
        console.log("Created successfully");
    } catch(err) {
        console.error("Error:", err.message);
    }
    mongoose.disconnect();
});
