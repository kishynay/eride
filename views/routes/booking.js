// In routes/booking.js
router.post('/create', async (req, res) => {
    try {
        const { pickupAddress, pickupLandmark, dropAddress, pickupDate, pickupTime, vehicleType, passengerName, passengerPhone } = req.body;
        
        // Determine final pickup string (address or landmark)
        const finalPickup = pickupLandmark || pickupAddress;
        
        // Save to database (adjust to your Booking model)
        const newBooking = new Booking({
            guestName: passengerName,
            guestPhone: passengerPhone,
            pickupLocation: { address: finalPickup },
            dropLocation: { address: dropAddress },
            pickupDate: new Date(`${pickupDate}T${pickupTime}`),
            vehicleType,
            status: 'pending',
            paymentMethod: 'cash',
            bookingSource: 'web'
        });
        
        await newBooking.save();
        res.render('booking/confirm', { booking: newBooking }); // Create a simple confirmation page
    } catch (err) {
        console.error(err);
        res.status(500).send('Booking failed. Please call helpline.');
    }
});