// // import express from "express";
// // import {
// //   getWorkouts,
// //   createWorkout,
// //   updateWorkout,
// //   deleteWorkout,
// // } from "../Controllers/workoutController.js";

// // const router = express.Router();

// // router.get("/", getWorkouts);
// // router.post("/create-workout", createWorkout);
// // router.put("/:id", updateWorkout);
// // router.delete("/:id", deleteWorkout);

// // export default router;

// import router from "express";
// import Workout from "../models/workoutSchema.js";

// // Create a new workout // POST request // http://localhost:5000/workouts/add
// router.route("/add").post((req, res) => {
//   const workoutData = req.body;
//   const newworkout = new Workout(workoutData);
//   newworkout
//     .save()
//     .then(() => {
//       res.json("Workout added!");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// // Get all workouts // GET request // http://localhost:5000/workouts/
// router.route("/").get((req, res) => {
//   Workout.find()
//     .then((workouts) => res.json(workouts))
//     .catch((err) => res.status(400).json("Error: " + err));
// });

// // Get a workout by ID // GET request // http://localhost:5000/workouts/get/:id
// router.route("/get/:id").get((req, res) => {
//   Workout.findById(req.params.id)
//     .then((workout) => res.json(workout))
//     .catch((err) => res.status(400).json("Error: " + err));
// });

// // Update a workout by ID // PUT request // http://localhost:5000/workouts/update/:id
// router.route("/update/:id").put((req, res) => {
//   Workout.findById(req.params.id)
//     .then((workout) => {
//       workout.Username = req.body.Username;
//       workout.bodyParts = req.body.bodyParts;
//       workout.exercises = req.body.exercises;

//       workout
//         .save()
//         .then(() => res.json("Workout updated!"))
//         .catch((err) => res.status(400).json("Error: " + err));
//     })
//     .catch((err) => res.status(400).json("Error: " + err));
// });

// // Delete a workout by ID // DELETE request // http://localhost:5000/workouts/delete/:id
// router.route("/delete/:id").delete((req, res) => {
//   Workout.findByIdAndDelete(req.params.id)
//     .then(() => res.json("Workout deleted."))
//     .catch((err) => res.status(400).json("Error: " + err));
// });

// module.exports = router;
