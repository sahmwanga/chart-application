const router = require('express').Router();

router.get('/channels', (req, res) => {
  res
    .json({
      channels: [
        { id: 1, name: 'CHANNEL ONE' },
        { id: 2, name: 'CHANNEL TWO' },
      ],
    })
    .status(200);
});

module.exports = router;
