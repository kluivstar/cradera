import Deposit from '../models/Deposit.js';
import Joi from 'joi';

const depositSchema = Joi.object({
    assetType: Joi.string().required(),
    network: Joi.string().required(),
    amount: Joi.number().positive().required(),
    txHash: Joi.string().required(),
    fromAddress: Joi.string().required(),
    toAddress: Joi.string().required(),
});

export const createDeposit = async (req, res) => {
    try {
        const { error, value } = depositSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const existingTx = await Deposit.findOne({ txHash: value.txHash });
        if (existingTx) {
            return res.status(409).json({ error: 'Transaction hash already exists' });
        }

        const deposit = new Deposit({
            ...value,
            userId: req.user._id,
            status: 'pending'
        });

        await deposit.save();

        res.status(201).json({
            message: 'Deposit submitted successfully',
            deposit
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error during deposit submission' });
    }
};

export const getMyDeposits = async (req, res) => {
    try {
        const deposits = await Deposit.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ deposits });
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching deposits' });
    }
};

export const getAllDeposits = async (req, res) => {
    try {
        const deposits = await Deposit.find()
            .populate('userId', 'email')
            .populate('verifiedBy', 'email')
            .sort({ createdAt: -1 });
        res.status(200).json({ deposits });
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching all deposits' });
    }
};

export const confirmDeposit = async (req, res) => {
    try {
        const deposit = await Deposit.findById(req.params.id);
        if (!deposit) {
            return res.status(404).json({ error: 'Deposit not found' });
        }

        if (deposit.status !== 'pending') {
            return res.status(400).json({ error: 'Deposit already processed' });
        }

        deposit.status = 'confirmed';
        deposit.verifiedBy = req.user._id;
        deposit.verifiedAt = new Date();
        deposit.adminNotes = req.body.adminNotes || 'Confirmed by admin';

        await deposit.save();

        res.status(200).json({ message: 'Deposit confirmed', deposit });
    } catch (err) {
        res.status(500).json({ error: 'Server error confirming deposit' });
    }
};

export const rejectDeposit = async (req, res) => {
    try {
        const deposit = await Deposit.findById(req.params.id);
        if (!deposit) {
            return res.status(404).json({ error: 'Deposit not found' });
        }

        if (deposit.status !== 'pending') {
            return res.status(400).json({ error: 'Deposit already processed' });
        }

        deposit.status = 'rejected';
        deposit.verifiedBy = req.user._id;
        deposit.verifiedAt = new Date();
        deposit.adminNotes = req.body.adminNotes || 'Rejected by admin';

        await deposit.save();

        res.status(200).json({ message: 'Deposit rejected', deposit });
    } catch (err) {
        res.status(500).json({ error: 'Server error rejecting deposit' });
    }
};
