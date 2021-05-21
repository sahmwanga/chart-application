const router = require('express').Router();

router.get('/channels', (req, res) => {
  res
    .json({
      channels: [
        { id: '255653679553', name: 'Salehe' },
        { id: '255653679550', name: 'Juma' },
      ],
    })
    .status(200);
});

module.exports = router;
