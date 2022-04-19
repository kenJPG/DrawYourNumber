function gen_cell(row_id, col_id) {
	return (
		`
		<div class="cell" id="${row_id}-${col_id}" data-row-id="${row_id}" data-col-id="${col_id}" style="width: 1rem; height: 1rem; border: 1px solid rgba(0,0,0,0.05); cursor: pointer;">
		</div>
		`
	)
}

function gen_row(row_id) {
	let row_str = `<div class="flex">`
	for (let col_id = 0; col_id < 28; col_id++) {
		row_str += gen_cell(row_id, col_id)
	}
	row_str += "</div>"
	return row_str
}

for (let row_id = 0; row_id < 28; row_id++) {
	$('#grid').append(
		gen_row(row_id)
	)
}

let data = new Array(28).fill(0).map(() => new Array(28).fill(0))

$('#grid').append(
	`
		<div class="flex w-full h-12">
			<button class="submit_button">
				Submit
			</button>
			<button class="clear_button">
				Clear
			</button>
		</div>
	`
)

function refresh_cell(row, col) {
	$(`#${row}-${col}`).css('background', `rgba(0,0,0,${data[row][col]})`)
}

function refresh_all() {
	for (let i = 0; i < 28; i++) {
		for (let j = 0; j < 28; j++) {
			refresh_cell(i, j);
		}
	}
}

function get_data() {
	let data_arr = []
	for (let i = 0; i < 28; i++) {
		for (let j = 0; j < 28; j++) {
			data_arr.push(data[i][j].toString());
		}
	}
	return data_arr.join(" ")
}

function paint_cell(row, col, thickness) {
	for (let div = 0; div <= thickness; div++) {
		let alpha = 1 / (div + 1);
		for (let row_change = -div; row_change <= div; row_change++) {
			for (let col_change = -div; col_change <= div; col_change++) {
				if (Math.abs(row_change) + Math.abs(col_change) == div) {
					let new_row = row_change + row;
					let new_col = col_change + col;
					if (new_row >= 0 && new_row < 28) {
						if (new_col >= 0 && new_col < 28) {
							data[new_row][new_col] = Math.min(1, data[new_row][new_col] + alpha);
						}
					}
				}
			}
		}
	}
	console.log(data)
	refresh_all()
}

let mouse_down = false

let thickness = 1;

$('.cell').on('mousedown', function(event) {
	event.preventDefault()
	mouse_down = true
})

$('.cell').on('mouseup', function(event) {
	event.preventDefault()
	mouse_down = false
	prev_row = -1; prev_col = -1;
})

let prev_row = -1, prev_col = -1;

$('.cell').on('mousemove', function(event) {
	event.preventDefault()
	let row = $(this).data("row-id")
	let col = $(this).data("col-id")
	if (!(prev_row == row && prev_col == col)) {
		if (mouse_down) {
			prev_row = row;
			prev_col = col;
			paint_cell(row, col, thickness)
			refresh_cell(row, col)
		}
	}
})

$('.clear_button').on('click', function(event) {
	data = new Array(28).fill(0).map(() => new Array(28).fill(0));
	refresh_all();
	$('#answer').text("")
})

$('.submit_button').on('click', async function(event) {
	try {
		let pass = get_data();
		let result = await axios({
			method: 'get',
			url: 'http://127.0.0.1:5000/classify',
			params: {
				'input': pass
			}
		})
		$('#answer').text(result.data.prediction)
	} catch (err) {
		console.log(err);
	}
})