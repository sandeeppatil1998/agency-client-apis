const Agency = require('../models/agency');
const Client = require('../models/client');

exports.createAgencyWithClient = async (req, res) => {
    try {
        const { name, address1, address2, state, city, phoneNumber, clients } = req.body;

        // Validate request body
        if (!name || !address1 || !state || !city || !phoneNumber || !clients || !Array.isArray(clients) || clients.length === 0) {
            return res.status(400).json({ error: "Missing or invalid required fields" });
        }

        // Create and save the agency
        const agency = new Agency({
            name,
            address1,
            address2,
            state,
            city,
            phoneNumber
        });

        const savedAgency = await agency.save();

        // Create and save the clients
        const clientPromises = clients.map(client => {
            const { name, email, phoneNumber, totalBill } = client;
            if (!name || !email || !phoneNumber || totalBill == null) {
                throw new Error('Missing required client fields');
            }
            return new Client({
                agencyId: savedAgency._id,
                name,
                email,
                phoneNumber,
                totalBill
            }).save();
        });

        await Promise.all(clientPromises);

        res.status(201).json({ agency: savedAgency });
    } catch (error) {
        console.error("Error creating agency with clients:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.getTopClientDetails = async (req, res) => {
    try {
        // Query to find the agency and client(s) with the highest total bill amount
        const topClient = await Client.findOne().sort({ totalBill: -1 }).populate('agencyId');

        if (!topClient) {
            return res.status(404).json({ msg: 'No clients found' });
        }

        // Extract agency name and client details
        const agencyName = topClient.agencyId.name;
        const clientName = topClient.name;
        const clientEmail = topClient.email;
        const clientPhoneNumber = topClient.phoneNumber;
        const totalBill = topClient.totalBill;

        // Construct the response object
        const response = {
            AgencyName: agencyName,
            ClientName: clientName,
            clientEmail: clientEmail,
            clientPhoneNumber: clientPhoneNumber,
            TotalBill: totalBill
        };

        // Return the response
        res.status(200).json(response);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server Error' });
    }
};
