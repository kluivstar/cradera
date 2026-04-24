import Deposit from './deposit.model.js';

export const createDeposit = async (data) => {
    const deposit = new Deposit(data);
    await deposit.save();
    return deposit;
};

export const getUserDeposits = async (userId) => {
    return await Deposit.find({ userId }).sort({ createdAt: -1 });
};
