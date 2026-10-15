import Advertisement from '../models/Advertisement.js';

// @desc    Get active advertisement
// @route   GET /api/advertisements
// @access  Public
export const getAdvertisement = async (req, res) => {
  try {
    const advertisement = await Advertisement.findOne({ placement: 'home' });
    if (!advertisement) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }
    res.json(advertisement);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update or create advertisement
// @route   PUT /api/advertisements
// @access  Private/Admin
export const updateAdvertisement = async (req, res) => {
  const { text, mediaUrl, mediaType, isActive, buttonLink, link } = req.body;
  const targetLink = buttonLink !== undefined ? buttonLink : link;

  try {
    let advertisement = await Advertisement.findOne({ placement: 'home' });

    if (advertisement) {
      advertisement.text = text !== undefined ? text : advertisement.text;
      advertisement.mediaUrl = mediaUrl !== undefined ? mediaUrl : advertisement.mediaUrl;
      advertisement.mediaType = mediaType !== undefined ? mediaType : advertisement.mediaType;
      advertisement.isActive = isActive !== undefined ? isActive : advertisement.isActive;
      if (targetLink !== undefined) {
        advertisement.buttonLink = targetLink;
        advertisement.link = targetLink;
      }

      const updatedAd = await advertisement.save();
      res.json(updatedAd);
    } else {
      const newAd = new Advertisement({
        text,
        mediaUrl,
        mediaType,
        isActive,
        buttonLink: targetLink !== undefined ? targetLink : '',
        link: targetLink !== undefined ? targetLink : '',
        placement: 'home'
      });
      const savedAd = await newAd.save();
      res.status(201).json(savedAd);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
