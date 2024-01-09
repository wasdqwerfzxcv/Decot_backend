const { StickyNote, User } = require('../models');

const createStickyNote = async (req, res) => {
    try {
        const { text, canvasId, x, y } = req.body;
        const userId = req.user.id; 
        const newStickyNote = await StickyNote.create({ text, canvasId, userId, x, y });
        const stickyNoteWithUser = await StickyNote.findByPk(newStickyNote.id, {
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
        const stickyNotes = await StickyNote.findAll({ 
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
        const stickyNote = await StickyNote.findByPk(stickyNoteId, {
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
        await StickyNote.destroy({ where: { id: stickyNoteId } });

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
