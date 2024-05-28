const Client = require('../models/client');

exports.updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        console.log(`Updating client with ID: ${id}`);
        console.log('Update data:', updateData);

        if (!updateData.name || !updateData.email || !updateData.phoneNumber || updateData.totalBill == null) {
            return res.status(400).json({ msg: 'Missing required fields' });
        }

        const client = await Client.findByIdAndUpdate(id, updateData, { new: true });

        if (!client) {
            return res.status(404).json({ msg: 'Client not found' });
        }

        res.status(200).json(client);
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ error: error.message });
    }
};
