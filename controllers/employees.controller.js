const Employee = require('./../models/employee.model');

exports.getAll = async (req, res) => {
    try {
      res.json(await Employee.find().populate('department'));
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
}

exports.getRandom = async (req, res) => {
    try {
      const count = await Employee.countDocuments();
      const rand = Math.floor(Math.random() * count);
      const employee = await Employee.findOne().populate('department').skip(rand);
      if(employee) res.json(employee);
      else res.status(404).json({ message: 'Not found...'});
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
}

exports.getOne = async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id).populate('department');
      if(employee) res.json(employee);
      else res.status(404).json({ message: 'Not found...'});
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
}

exports.addNew = async (req, res) => {
    try {
      const { firstName, lastName, department } = req.body;
      const newEmployee = new Employee({firstName, lastName, department});
      await newEmployee.save();
      res.json({ message: 'OK' });
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
}

exports.editOne = async (req, res) => {
    try {
      const { firstName, lastName, department } = req.body;
      const employee = await Employee.findById(req.params.id);
      if(employee){
        await Employee.updateOne({_id: req.params.id}, {$set: {firstName, lastName, department}});
        res.json({ message: 'OK' });
      } else res.status(404).json({ message: 'Not found...' });
    }
    catch(err) {
      res.status(500).json({message: err });
    }
}

exports.removeOne = async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
      if(employee){
        await Employee.deleteOne({ _id: req.params.id });
        res.json({ message: 'OK' });
      } else res.status(404).json({ message: 'Not found...' });
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
}