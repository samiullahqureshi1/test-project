import { bannerModel } from "../model/banners.js";

export const createBanner = async (req, res) => {
  try {
    //let image=req.file.originalname
    let image = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    req.body.image = image;
    let data = new bannerModel(req.body);
    let saveData = await data.save(data);
    res.status(200).send({
      message: "successfully banner created",
      data: saveData,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getBanner = async (req, res) => {
  try {
    const data = await bannerModel.find();
    res.status(200).send({
      message: "record founds",
      data,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const bannerId = req.params.id;
    const existingBanner = await bannerModel.findById(bannerId);
    if (!existingBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    let image;
    if (req.file) {
      image = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    } else {
      image = existingBanner.image;
    }

    const updatedData = {
      ...req.body,
      image: image,
    };

    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] === undefined) {
        delete updatedData[key];
      }
    });

    const updatedBanner = await bannerModel.findByIdAndUpdate(
      bannerId,
      updatedData,
      { new: true }
    );

    res.status(200).send({
      message: "Banner successfully updated",
      data: updatedBanner,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBanners = async (req, res) => {
  try {
    const { id } = req.params;
    const query = { $set: req.body };
    const data = await bannerModel.findByIdAndDelete(id, query);
    res.status(200).send({
      message: "banner properly deleted",
      data,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};
