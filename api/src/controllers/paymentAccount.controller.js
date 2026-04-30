import PaymentAccount from '../models/PaymentAccount.js';

// @desc    Create a new payment account
// @route   POST /api/payment-accounts
// @access  Private (User)
export const createPaymentAccount = async (req, res) => {
    try {
        const { accountName, bankName, accountNumber, cryptoWalletAddress, network, type, isDefault } = req.body;

        // If this is the first account or marked as default, unset other defaults
        if (isDefault) {
            await PaymentAccount.updateMany({ userId: req.user._id }, { isDefault: false });
        }

        const count = await PaymentAccount.countDocuments({ userId: req.user._id });
        
        const paymentAccount = await PaymentAccount.create({
            userId: req.user._id,
            accountName,
            bankName,
            accountNumber,
            cryptoWalletAddress,
            network,
            type,
            isDefault: isDefault || count === 0 // Default if it's the first account
        });

        res.status(201).json({
            message: 'Payment account added successfully',
            paymentAccount
        });
    } catch (err) {
        res.status(500).json({ error: 'Error adding payment account' });
    }
};

// @desc    Get my payment accounts
// @route   GET /api/payment-accounts
// @access  Private (User)
export const getMyPaymentAccounts = async (req, res) => {
    try {
        const paymentAccounts = await PaymentAccount.find({ userId: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
        res.status(200).json({ paymentAccounts });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching payment accounts' });
    }
};

// @desc    Update a payment account
// @route   PATCH /api/payment-accounts/:id
// @access  Private (User)
export const updatePaymentAccount = async (req, res) => {
    try {
        const { isDefault, accountName } = req.body;
        const account = await PaymentAccount.findOne({ _id: req.params.id, userId: req.user._id });

        if (!account) {
            return res.status(404).json({ error: 'Payment account not found' });
        }

        if (isDefault) {
            await PaymentAccount.updateMany({ userId: req.user._id }, { isDefault: false });
            account.isDefault = true;
        }

        if (accountName) account.accountName = accountName;

        await account.save();

        res.status(200).json({
            message: 'Payment account updated successfully',
            paymentAccount: account
        });
    } catch (err) {
        res.status(500).json({ error: 'Error updating payment account' });
    }
};
