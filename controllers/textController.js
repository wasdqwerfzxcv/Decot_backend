const { Text, User } = require('../models');

const createText = async (req, res) => {
    try {
        const { text, canvasId, x, y, width, height } = req.body;
        const userId = req.user.id; 
        const newText = await Text.create({ text, canvasId, userId, x, y });
        const stickyNoteWithUser = await Text.findByPk(newStickyNote.id, {
            include: [{ model: User }]
        });
        if (stickyNoteWithUser) {
            res.status(201).json({ stickyNote: stickyNoteWithUser });    
        } else {
            res.status(404).json({ error: "Sticky Note created but not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getStickyNotes = async (req, res) => {
    try {
        const canvasId = req.params.canvasId; 
        const stickyNotes = await Text.findAll({ 
            where: { canvasId: canvasId },
            include: [{ model: User }] 
        });
        if (stickyNotes && stickyNotes.length > 0) {
            res.json({ stickyNotes: stickyNotes });
        } else {
            res.json({ stickyNotes: [], message: "No sticky notes found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateStickyNote = async (req, res) => {
    try {
        const stickyNoteId = req.params.stickyNoteId;
        const { text, x, y } = req.body;
        const stickyNote = await Text.findByPk(stickyNoteId, {
            include: [{ model: User }]
        });

        if (!stickyNote) {
            return res.status(404).json({ error: 'Sticky note not found' });
        }

        stickyNote.text = text;
        stickyNote.x = x;
        stickyNote.y = y;

        await stickyNote.save();
        res.json({ stickyNote });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteStickyNote = async (req, res) => {
    try {
        const stickyNoteId = req.params.stickyNoteId;
        await Text.destroy({ where: { id: stickyNoteId } });

        res.json({ message: 'Sticky note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createStickyNote,
    getStickyNotes,
    updateStickyNote,
    deleteStickyNote,
};
