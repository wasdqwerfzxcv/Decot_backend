const { Textbox, User } = require('../models');

const createTextbox = async (req, res) => {
    try {
        const { text, canvasId, x, y } = req.body;
        const userId = req.user.id; 
        const newTextbox = await Textbox.create({ text, canvasId, userId, x, y });
        const textboxWithUser = await Textbox.findByPk(newTextbox.id, {
            include: [{ model: User }]
        });
        if (textboxWithUser) {
            res.status(201).json({ textbox: textboxWithUser });    
        } else {
            res.status(404).json({ error: "Textbox created but not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTextboxes = async (req, res) => {
    try {
        const canvasId = req.params.canvasId; 
        const textboxes = await Textbox.findAll({ 
            where: { canvasId: canvasId },
            include: [{ model: User }] 
        });
        if (textboxes && textboxes.length > 0) {
            res.json({ textboxes: textboxes });
        } else {
            res.json({ textboxes: [], message: "No textboxes found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTextbox = async (req, res) => {
    try {
        const textboxId = req.params.textboxId;
        const { text, x, y } = req.body;
        const textbox = await Textbox.findByPk(textboxId, {
            include: [{ model: User }]
        });

        if (!textbox) {
            return res.status(404).json({ error: 'Textbox not found' });
        }
        textbox.text = text;
        textbox.x = x;
        textbox.y = y;

        await textbox.save();
        res.json({ textbox });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteTextbox = async (req, res) => {
    try {
        const textboxId = req.params.textboxId;
        await Textbox.destroy({ where: { id: textboxId } });

        res.json({ message: 'Textbox deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTextbox,
    getTextboxes,
    updateTextbox,
    deleteTextbox,
};
