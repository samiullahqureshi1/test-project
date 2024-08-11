import { authModel } from "../model/auth.js";
import { productModel } from "../model/product.js";
import {
  productValidationSchema,
  updateProductValidationSchema,
} from "../validations/product.js";

export const createProduct = async (req, res) => {
  try {
    const { error, value } = productValidationSchema.validate(req.body);

    if (error) {
      throw new Error(error.details[0].message);
    }
    let image = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    req.body.image = image;
    let data = new productModel(req.body);
    let saveData = await data.save(data);
    res.status(200).send({
      message: "successfully product created",
      data: saveData,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await productModel.find();
    res.status(200).send({
      message: "record founds",
      product,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).send({
        message: "id is requires",
      });
    }
    const product = await productModel.findById(id);
    res.send({
      message: "product found",
      product,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

export const getNewArrivals = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber <= 0) {
      return res.status(400).send({
        message: "Invalid limit value",
      });
    }

    const newArrivals = await productModel.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: limitNumber,
      },
      {
        $project: {
          name: 1,
          price: 1,
          image: 1,
        },
      },
    ]);
    res.status(200).send({
      message: "New arrivals fetched successfully",
      data: newArrivals,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { error, value } = updateProductValidationSchema.validate(req.body);

    if (error) {
      throw new Error(error.details[0].message);
    }
    const productId = req.params.id;
    const existingProduct = await productModel.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    let image;
    if (req.file) {
      image = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    } else {
      image = existingProduct.image;
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

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true }
    );

    res.status(200).send({
      message: "Product successfully updated",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productModel.findByIdAndDelete(id);
    res.status(200).send({
      message: "Product properly deleted",
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

export const getRecommended = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userData = await authModel.findById(userId).select("tags");
    console.log(userData);

    const userTags = userData.tags || [];

    const filteredProducts = await productModel.find({
      $text: { $search: userTags.join(" ") },
    });

    res.send(filteredProducts);
  } catch (error) {
    res.send(error.message);
  }
};
