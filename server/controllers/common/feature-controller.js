const Feature = require('../../models/features');

const addFeatureImage = async (req, res) => {
    try {
        const { imageData } = req.body;
        // extract the URL string from the object
        const imageUrl = typeof imageData === 'string' ? imageData : imageData.uploadedImageUrl;

        console.log("imageUrl", imageUrl);

        const newFeature = new Feature({ image: imageUrl });
        await newFeature.save();

        res.status(201).json({ success: true, message: 'Feature image added successfully', data: newFeature });
    } catch (error) {
        console.error('Error adding feature image:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}


const getFeatureImage = async (req, res) => {
    try {
        const images = await Feature.find({});
        res.status(200).json({ success: true, data: images });
    } catch (error) {
        console.error('Error adding feature image:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

const deleteFeatureImage = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedImage = await Feature.findByIdAndDelete(id);
        if (!deletedImage) {
            return res.status(404).json({ success: false, message: 'Feature image not found' });
        }
        res.status(200).json({ success: true, message: 'Feature image deleted successfully' });
    } catch (error) {
        console.error('Error deleting feature image:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}
module.exports = {
    addFeatureImage,
    getFeatureImage,
    deleteFeatureImage
}