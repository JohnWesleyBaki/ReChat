const { ObjectId } = require('mongodb');
const db = require('../db/connection');

const collection = 'users';

const findAll = async (options = {}) => {
  try {
    return await db.collection(collection).find({}, options).toArray();
  } catch (error) {
    console.error('Error finding all users:', error);
    throw error;
  }
};

const findById = async (id) => {
  try {
    return await db.collection(collection).findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error('Error finding user by id:', error);
    throw error;
  }
};

const findByEmail = async (email) => {
  try {
    return await db.collection(collection).findOne({ email });
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

const create = async (userData) => {
  try {
    const result = await db.collection(collection).insertOne({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return result.ops[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

const updateById = async (id, updateData) => {
  try {
    const result = await db.collection(collection).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result.value;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  updateById
};