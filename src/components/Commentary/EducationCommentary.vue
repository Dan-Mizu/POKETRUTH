<template>
	<div
		class="flex flex-col text-align-center items-center justify-center mx-32 max-w-[42rem]"
	>
		<div class="flex flex-col gap-y-5 text-start text-xl">
			<p>
				We are slacking when it comes to higher education on average.
				Maybe it's because a lot of us are focused on a different type
				of high. Stay in school y&rsquo;all.
			</p>
			<table>
				<tbody class="text-base">
					<tr>
						<th>Education Level</th>
						<th>Twitch Survey (%)</th>
						<th>U.S. Average (%)</th>
						<th>Difference (%)</th>
					</tr>
					<tr>
						<td>Doctorate</td>
						<td>0.80%</td>
						<td>2%</td>
						<td>-1.20</td>
					</tr>
					<tr>
						<td>Master's</td>
						<td>2.53%</td>
						<td>11%</td>
						<td>-8.47</td>
					</tr>
					<tr>
						<td>Bachelor's</td>
						<td>18.67%</td>
						<td>22%</td>
						<td>-3.33</td>
					</tr>
					<tr>
						<td>Associates / Trade</td>
						<td>6.88%</td>
						<td>11%</td>
						<td>-4.12</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<style lang="css" scoped>
/* table */
table {
	@apply w-full border-separate border-spacing-0 text-lg;
}

/* rounded corners */
table tr:first-child th:first-child {
	@apply rounded-tl-[0.5rem];
}
table tr:first-child th:last-child {
	@apply rounded-tr-[0.5rem];
}
table tr:last-child td:first-child {
	@apply rounded-bl-[0.5rem];
}
table tr:last-child td:last-child {
	@apply rounded-br-[0.5rem];
}

/* cells */
td,
th {
	@apply text-left border p-2 border-gray-200 dark:border-gray-700;
}

/* alternating background for readability */
tr:nth-child(even) {
	@apply bg-gray-100 dark:bg-gray-900;
}
</style>
