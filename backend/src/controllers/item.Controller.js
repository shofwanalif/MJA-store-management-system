const prisma = require('../prismaClient');

const getItems = async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (!items) return res.status(404).json({ message: 'Items not found' });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'failed to fetch items', error: error.message });
  }
};

const getItemById = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) return res.status(404).json({ message: 'item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'failed to fetch item', error: error.message });
  }
};

const createItem = async (req, res) => {
  const { name, priceRetail, priceWholesale, stock } = req.body;
  try {
    const item = await prisma.item.create({
      data: {
        name,
        priceRetail: Number(priceRetail),
        priceWholesale: Number(priceWholesale),
        stock: Number(stock),
      },
    });
    res.status(200).json({ message: 'Item created successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Failed create item', error: error.message });
  }
};

const updateItem = async (req, res) => {
  const id = Number(req.params.id);
  const { name, priceRetail, priceWholesale, stock } = req.body;
  try {
    const updated = await prisma.item.update({
      where: { id },
      data: {
        name,
        priceRetail: Number(priceRetail),
        priceWholesale: Number(priceWholesale),
        stock: Number(stock),
      },
    });
    res.status(200).json({ message: 'item updated!', item: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update item', error: error.message });
  }
};

const deleteItem = async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.item.delete({
      where: { id },
    });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
