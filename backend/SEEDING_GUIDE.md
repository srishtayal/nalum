
# Seeding Guide

This document provides instructions on how to seed the database with initial data for development and testing purposes.

## Profile Seeder

The profile seeder populates the database with a set of sample user profiles that can be used to test features like search and profile display.

### How to Run

To run the profile seeder, use the following command:

```bash
npm run seed:profiles
```

### Seeded Data

The seeder creates the following user accounts:

| Name            | Email                     | Password      | Batch | Branch             | Campus        | Skills                               |
| --------------- | ------------------------- | ------------- | ----- | ------------------ | ------------- | ------------------------------------ |
| John Doe        | johndoe@example.com       | password123   | 2020  | Computer Science   | Main Campus   | JavaScript, React, Node.js           |
| Jane Smith      | janesmith@example.com     | password123   | 2021  | Electronics        | North Campus  | Embedded Systems, C++, Arduino       |
| Peter Jones     | peterjones@example.com    | password123   | 2020  | Mechanical         | Main Campus   | AutoCAD, SolidWorks, MATLAB          |
| Susan Williams  | susanwilliams@example.com | password123   | 2022  | Computer Science   | South Campus  | Python, Django, Machine Learning     |
| David Brown     | davidbrown@example.com    | password123   | 2021  | Civil              | West Campus   | STAAD Pro, AutoCAD, Primavera        |

Each user has a placeholder profile picture provided by [Pravatar](https://i.pravatar.cc/).

### Notes

- The seeder will not create duplicate users. If a user with the same email already exists, it will be skipped.
- The default password for all seeded users is `password123`.
- All seeded users are marked as verified.
