import { defineNuxtPlugin } from "#app";
import * as echarts from "echarts/core";
import "echarts-wordcloud"; // Import it only on the client

export default defineNuxtPlugin((nuxtApp) => {
	// Attach echarts to the Nuxt app for global use
	nuxtApp.provide("echarts", echarts);
});
