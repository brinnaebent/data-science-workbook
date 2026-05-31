import type { Chapter } from "@brinnaebent/workbook";
import whyComputersSpeakInNumbers from "./01-why-computers-speak-in-numbers";
import whyConvertingIdeasIsHard from "./02-why-converting-ideas-is-hard";
import tabularDataAndEncoding from "./03-tabular-data-and-encoding";
import historicalTimeSeries from "./04-historical-time-series";
import sensorData from "./05-sensor-data";
import imagesAndVideo from "./06-images-and-video";
import text from "./07-text";
import userBehaviorAndCombinedTypes from "./08-user-behavior-and-combined-types";

const informationRepresentation: Chapter = {
  id: "information-representation",
  number: 1,
  title: "Information Representation",
  overview:
    "Every piece of data your model will ever see — images, text, sensor readings, user clicks — must live inside a computer as numbers. This chapter explains why that's true, why it's harder than it sounds, and how to make smart choices when converting the messy real world into numeric representations.",
  sections: [
    whyComputersSpeakInNumbers,
    whyConvertingIdeasIsHard,
    tabularDataAndEncoding,
    historicalTimeSeries,
    sensorData,
    imagesAndVideo,
    text,
    userBehaviorAndCombinedTypes,
  ],
};

export default informationRepresentation;
