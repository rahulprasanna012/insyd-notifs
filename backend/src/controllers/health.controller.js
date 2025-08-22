
const healthz = async (req, res) => {
  res.status(200).json({ status: "ok" });
};

module.exports = healthz;