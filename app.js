// Import các module cần thiết
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')

// Khởi tạo Express app
const app = express();
app.use(cors())

// Kết nối tới MongoDB, thay 'your_mongodb_uri' bằng URI kết nối của bạn
mongoose.connect('mongodb+srv://Malino2000:Malino2000@luck-malino.kfopcvv.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Connection error:', err));

// Định nghĩa schema cho người dùng
const userSchema = new mongoose.Schema({
    username: String,
    phonenumber: String,
    age: Number,
    spincount: Number // Thêm trường spincount vào schema
  });
  
  const User = mongoose.model('User', userSchema);
  
  // Sử dụng bodyParser để parse dữ liệu từ request body
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  
  // API để thêm người dùng mới
 // API để thêm người dùng mới
app.post('/api/users', async (req, res) => {
  try {
    const { username, phonenumber, age } = req.body;

    // Kiểm tra xem người dùng đã tồn tại hay chưa dựa vào username và phonenumber
    const existingUser = await User.findOne({ username, phonenumber });

    if (existingUser) {
      // Người dùng đã tồn tại
      res.status(409).json({ error: 'User already exists' });
    } else {
      // Người dùng không tồn tại, thêm người dùng mới vào cơ sở dữ liệu
      const newUser = new User({ username, phonenumber, age, spincount: 0 });
      await newUser.save();
      res.json(newUser);
    }
  } catch (err) {
    res.status(500).json({ error: 'Error adding new user' });
  }
});
// API để kiểm tra thông tin người dùng và chuyển hướng sang trang SpinCountPage
app.post('/api/check-user', async (req, res) => {
  try {
    const { username, phonenumber, age } = req.body;

    // Kiểm tra xem age có phải là một số nguyên không âm
    if (!Number.isInteger(parseInt(age)) || parseInt(age) < 0) {
      res.status(400).json({ error: 'Invalid age' });
      return;
    }

    // Kiểm tra xem người dùng đã tồn tại hay chưa dựa vào username và phonenumber
    const existingUser = await User.findOne({ username, phonenumber });

    if (!existingUser) {
      res.status(404).json({ error: 'User not found' });
    } else {
      // Người dùng tồn tại, kiểm tra age
      if (existingUser.age !== parseInt(age)) {
        res.status(400).json({ error: 'Invalid age' });
      } else {
        // Thông tin người dùng hợp lệ, chuyển hướng sang trang SpinCountPage
        res.json({ redirectTo: `/spincount?username=${username}&phonenumber=${phonenumber}&age=${age}` });
      }
    }
  } catch (err) {
    res.status(500).json({ error: 'Error checking user information' });
  }
});
// app.post('/api/check-user', async (req, res) => {
//   try {
//     const { username, phonenumber } = req.body;

//     // Kiểm tra xem người dùng đã tồn tại hay chưa dựa vào username và phonenumber
//     const existingUser = await User.findOne({ username, phonenumber });

//     if (!existingUser) {
//       res.status(404).json({ error: 'User not found' });
//     } else {
//       // Người dùng tồn tại, chuyển hướng sang trang SpinCountPage
//       res.json({ redirectTo: `/spincount?username=${username}&phonenumber=${phonenumber}` });
//     }
//   } catch (err) {
//     res.status(500).json({ error: 'Error checking user information' });
//   }
// });



  
  // API để lấy spin count của người dùng dựa trên thông tin username, phonenumber, age
// API để cập nhật spin count của người dùng
// app.get('/api/users/spincount', async (req, res) => {
//   try {
//     const { username, phonenumber, age } = req.query;

//     console.log('Searching for user with:', username, phonenumber, age);

//     // Tìm người dùng dựa trên thông tin username, phonenumber, age
//     const user = await User.findOne({ username, phonenumber, age });

//     if (!user) {
//       console.log('User not found');
//       res.status(404).json({ error: 'User not found' });
//     } else {
//       console.log('Found user:', user);
//       res.json({ spincount: user.spincount });
//     }
//   } catch (err) {
//     console.error('Error:', err);
//     res.status(500).json({ error: 'Error getting spin count' });
//   }
// });
// app.get('/api/users/spincount', async (req, res) => {
//   try {
//     const { username, phonenumber, age=0 } = req.query;

//     console.log('Searching for user with:', username, phonenumber, age);

//     // Convert the age value to a number using parseInt
//     const ageValue = parseInt(age, 10);

//     // Check if ageValue is a valid number
//     if (isNaN(ageValue) || ageValue < 0) {
//       res.status(400).json({ error: 'Invalid age value' });
//       return;
//     }

//     // Tìm người dùng dựa trên thông tin username, phonenumber, age
//     const user = await User.findOne({ username, phonenumber, age: ageValue });

//     if (!user) {
//       console.log('User not found');
//       res.status(404).json({ error: 'User not found' });
//     } else {
//       console.log('Found user:', user);
//       res.json({ spincount: user.spincount });
//     }
//   } catch (err) {
//     console.error('Error:', err);
//     res.status(500).json({ error: 'Error getting spin count' });
//   }
// });
app.get('/api/users/spincount', async (req, res) => {
  try {
    const { username, phonenumber } = req.query;

    console.log('Searching for user with:', username, phonenumber);

    // Tìm người dùng dựa trên thông tin username và phonenumber
    const user = await User.findOne({ username, phonenumber });

    if (!user) {
      console.log('User not found');
      res.status(404).json({ error: 'User not found' });
    } else {
      console.log('Found user:', user);
      res.json({ spincount: user.spincount });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error getting spin count' });
  }
});




// API để cập nhật spin count của người dùng
// app.put('/api/users/spin', async (req, res) => {
//   try {
//     const { username, phonenumber, age, spincount } = req.body;

//     // Kiểm tra xem spincount có phải là một số nguyên không âm
//     if (!Number.isInteger(parseInt(spincount)) || parseInt(spincount) < 0) {
//       res.status(400).json({ error: 'Invalid spincount' });
//       return;
//     }

//     // Kiểm tra xem người dùng đã tồn tại hay chưa dựa vào username, phonenumber và age
//     const existingUser = await User.findOne({ username, phonenumber, age });

//     if (!existingUser) {
//       res.status(404).json({ error: 'User not found' });
//     } else {
//       // Cập nhật spincount cho người dùng
//       existingUser.spincount = parseInt(spincount);
//       await existingUser.save();

//       // Trả về thông tin người dùng đã được cập nhật
//       res.json(existingUser);
//     }
//   } catch (err) {
//     res.status(500).json({ error: 'Lỗi khi cập nhật spincount.' });
//   }
// });
// API để cập nhật spin count của người dùng
// app.put('/api/users/spin', async (req, res) => {
//   try {
//     const { username, phonenumber, age, spincount } = req.body;

//     // Kiểm tra xem spincount có phải là một số nguyên không âm
//     if (!Number.isInteger(parseInt(spincount)) || parseInt(spincount) < 0) {
//       res.status(400).json({ error: 'Invalid spincount' });
//       return;
//     }

//     // Convert the age value to a number using parseInt
//     const ageValue = parseInt(age, 10);

//     // Kiểm tra xem người dùng đã tồn tại hay chưa dựa vào username, phonenumber và age
//     const existingUser = await User.findOne({ username, phonenumber, age: ageValue });

//     if (!existingUser) {
//       res.status(404).json({ error: 'User not found' });
//     } else {
//       // Cập nhật spincount cho người dùng
//       existingUser.spincount = parseInt(spincount);
//       await existingUser.save();

//       // Trả về thông tin người dùng đã được cập nhật
//       res.json(existingUser);
//     }
//   } catch (err) {
//     res.status(500).json({ error: 'Lỗi khi cập nhật spincount.' });
//   }
// });
// app.put('/api/users/spin', async (req, res) => {
//   try {
//     const { username, phonenumber, age, spincount } = req.body;

//     // Kiểm tra xem spincount có phải là một số nguyên không âm
//     if (!Number.isInteger(parseInt(spincount)) || parseInt(spincount) < 0) {
//       res.status(400).json({ error: 'Invalid spincount' });
//       return;
//     }

//     // Convert the age value to a number using parseInt
//     const ageValue = parseInt(age, 10);

//     // Kiểm tra xem người dùng đã tồn tại hay chưa dựa vào username, phonenumber và age
//     const existingUser = await User.findOne({ username, phonenumber, age: ageValue });

//     if (!existingUser) {
//       res.status(404).json({ error: 'User not found' });
//     } else {
//       // Cập nhật spincount cho người dùng
//       existingUser.spincount = parseInt(spincount);
//       await existingUser.save();

//       // Trả về thông tin người dùng đã được cập nhật
//       res.json(existingUser);
//     }
//   } catch (err) {
//     res.status(500).json({ error: 'Lỗi khi cập nhật spincount.' });
//   }
// });
app.put('/api/users/spin', async (req, res) => {
  try {
    const { username, phonenumber, age, spincount } = req.body;

    // Kiểm tra xem spincount có phải là một số nguyên không âm
    if (!Number.isInteger(parseInt(spincount)) || parseInt(spincount) < 0) {
      res.status(400).json({ error: 'Invalid spincount' });
      return;
    }

    // Convert the age value to a number using parseInt
    const ageValue = parseInt(age, 10);

    // Kiểm tra xem người dùng đã tồn tại hay chưa dựa vào username, phonenumber và age
    const existingUser = await User.findOne({ username, phonenumber, age: ageValue });

    if (!existingUser) {
      res.status(404).json({ error: 'User not found' });
    } else {
      // Update spincount for the user
      existingUser.spincount = parseInt(spincount);

      // Save the updated user object
      const updatedUser = await existingUser.save();

      // Trả về thông tin người dùng đã được cập nhật
      res.json(updatedUser);
    }
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi cập nhật spincount.' });
  }
});



  // API để cập nhật số lượt quay của người dùng sau khi đã quay
app.get('/api/users/spin', async (req, res) => {
  try {
    const { username, phonenumber, age, spincount } = req.query;

    // Kiểm tra xem spincount có phải là một số nguyên không âm
    if (!Number.isInteger(parseInt(spincount)) || parseInt(spincount) < 0) {
      res.status(400).json({ error: 'Invalid spincount' });
      return;
    }

    // Convert the age value to a number using parseInt
    const ageValue = parseInt(age, 10);

    // Kiểm tra xem người dùng đã tồn tại hay chưa dựa vào username, phonenumber và age
    const existingUser = await User.findOne({ username, phonenumber, age: ageValue });

    if (!existingUser) {
      res.status(404).json({ error: 'User not found' });
    } else {
      // Cập nhật spincount cho người dùng
      existingUser.spincount = parseInt(spincount);
      await existingUser.save();

      // Trả về thông tin người dùng đã được cập nhật
      res.json(existingUser);
    }
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi cập nhật spincount.' });
  }
});

  app.put('/api/users/:id', async (req, res) => {
    try {
      // Lấy ID của người dùng từ URL
      const userId = req.params.id;
  
      // Lấy thông tin spincount từ request body
      const { spincount } = req.body;
  
      // Tìm và cập nhật người dùng theo ID
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { spincount } },
        { new: true } // Trả về người dùng đã được cập nhật thay vì người dùng cũ
      );
  
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi cập nhật spincount.' });
    }
  });

// Khởi động server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
