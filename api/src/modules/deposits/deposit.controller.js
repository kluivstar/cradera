import * as depositService from './deposit.service.js';

export const handleCreateDeposit = async (req, res) => {
    try {
        const { assetType, network, amount, txHash, fromAddress, toAddress } = req.body;

        // Basic validation
        if (!assetType || !network || !amount || !txHash) {
            return res.status(400).json({ error: 'Missing required fields: assetType, network, amount, txHash' });
        }

        const deposit = await depositService.createDeposit({
            userId: req.user._id,
            assetType,
            network,
            amount,
            txHash,
            fromAddress,
            toAddress
        });

        res.status(201).json({
            message: 'Deposit submitted successfully',
            deposit
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'This transaction hash has already been submitted' });
        }
        res.status(500).json({ error: 'Server error while creating deposit' });
    }
};

export const handleGetMeDeposits = async (req, res) => {
    try {
        const deposits = await depositService.getUserDeposits(req.user._id);
        res.status(200).json({ deposits });
    } catch (err) {
        res.status(500).json({ error: 'Server error while fetching deposits' });
    }
};

export const handleUpdateStatus = async (req, res) => {
    // Admin logic not implemented yet
};
