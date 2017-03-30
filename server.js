'use strict';
const dotenv = require('dotenv').config();
const moment = require('moment');
const express = require('express');
const mongoose = require('mongoose');
const exif = require('exif');
const multer_ = require('multer');
const sharp_ = require('sharp');
const bodyParser = require('body-parser');
const fileSystem = require('fs');
const app = express();

app.use(express.static('public/'));
app.listen(3000);