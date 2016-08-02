/* Copyright (c) Shrumit Mehta 2016. All rights reserved. */

var course_selc = [];
$(document).ready(function() {

	let term = -1; // flag for term selected
	let selc = []; // selected courses id
	let timePref = 1; //late/early class preference; default: 1=late

	let url = window.location.origin;

	// Remove :focus from button
	$("button").click(function() {
		$(this).blur();
	});

	// Load search boxes and make hidden
	(function loadSelect() {
		const termNames = ['first term', 'second term']; // stores term names

		for (i = 0; i < 2; i++) {
			let selector = `select[data-id=${i}]`;
			let placeholdertext = `Search for ${termNames[i]} and full year courses`;
			$.getJSON(`${url}/search/${i}`, function(res) {
				$(selector).empty().append("<option></option>");
				$(selector).select2({
					data: res,
					placeholder: placeholdertext,
					minimumInputLength: 2
				})
				$("#select-div" + i).hide();
			})
		}
	})()

	// Toggle select2 visibility
	function toggleSelect() {
		$("#select-div" + term).show();
		// $("#select"+(1-term)).select2('val', null);
		$("#select-div" + (1 - term)).hide();
	}

	// Toggle Fall/Winter terms
	$(".toggle").click(function() {
		var button = $(this).attr('data-id');
		if (term == button)
			return;

		term = button;
		toggleSelect();
		$('#clear').click();

		switch (button) {
			case "0":
				$("#winter").removeClass("pure-button-active");
				$("#fall").addClass("pure-button-active");
				break;
			case "1":
				$("#fall").removeClass("pure-button-active");
				$("#winter").addClass("pure-button-active");
				break;
		}

	});

	// Set Fall as default term
	$("#fall").click();

	var solutions;
	// Remove course from list
	$('ul').on('click', '.list-cross', function() {
		index = selc.indexOf($(this).closest('li').attr("data-id"));
		selc.splice(index, 1);
		course_selc.splice(index, 1);
		if (course_selc.length == 0)
			$('#clear').hide();
		$(this).closest('li').remove();
		return false;
	});

	// Expand sections div
	$('ul').on('click', '.list-title', function() {
		$(this).blur();
		id = $(this).closest('li').attr('data-id');
		// if ($(`.section-div[data-id=${id}]`).css('display') == 'none')
		// $('.section-div').css('display', 'none');
		$(`.section-div[data-id=${id}]`).slideToggle(100);
		return false;
	});

	// Clear All button
	$('#clear').on('click', function() {
		selc = [];
		course_selc = [];
		$('#list').empty();
	});

	//About button to display footer
	/*
	$('#about').click(function() {
		$('footer').slideToggle(100);
	});
	*/

	// Add course button
	$('#add').click(function() {
		$(this).blur();
		
		// check for emptiness or duplicacy
		id = $('#select' + term).select2('data')[0].id;
		if ((id == "") || (selc.indexOf(id) != -1))
			return;
		
		$('#clear').show();
		selc.push(id);

		$.getJSON(`${url}/api/${id}`, function(data) {
			$('#list').append(sec_template(data));
			course_selc.push(data);
		});

	});
	
	$('#time-pref-form input').change(function(){
		timePref =	$(this).val();
	});
	
	$('#more').click(function(){
		if (solutions.length > 0){
			makeTimetables();
		}
	});

	// Compile Handlebars
	let template = $('#list-template').html();
	let sec_template = Handlebars.compile(template);

	template = $('#timetable-template').html();
	let table_template = Handlebars.compile(template);

	template = $('#row-template').html();
	let row_template = Handlebars.compile(template);


	// COMPUTE!
	$('#compute').click(function() {
		$('#timetable-div').html('');
		$('#more').hide();
		$('#info-text').text("");
		if (course_selc.length > 0) {
			//$('#compute').prop('disabled');
			let start = new Date().getTime();
			computeEngine();
			let end = new Date().getTime();
			$('#info-text').append(` Computed in ${end-start}ms.`);
			makeTimetables();
		}
	});

	// Compute Logic
	function computeEngine() {
		'use strict';

		// CREATE MASTER
		let master = [];
		for (let i = 0; i < course_selc.length; i++) {
			for (let j = 0; j < course_selc[i].components.length; j++)
				master.push(JSON.parse(JSON.stringify(course_selc[i].components[j].sections)));
		}

		// remove disabled sections
		for (let i = 0; i < master.length; i++) {
			master[i] = master[i].filter(function(sec) {
				if (sec.hasOwnProperty("disabled") && sec.disabled === true){
					return false;
				}
				else{
					return true;
				}
			});
		}

		// SORT MASTER - lowest # of sections first
		master.sort(function(a, b) {
			return a.length - b.length;
		})
		

		// HEURISTIC for score threshold
		let thresholds = [0, 3, 2.25, 1.7, 1.55, 1.3, 1.2, 1.05, 1]
		let level = 0;
		let bar;
		let maxperm = 1;
		for (let i = 0; i < master.length; i++) {
			maxperm *= master[i].length;
		}
		if (maxperm > 10000000) {
			level = 1;
		}
		bar = thresholds[level];

		// INITIALIZE
		let stack = [];
		let table = [0, 0, 0, 0, 0];
		solutions = [];
		let index = 0;
		let count = 0;

		console.log('running with bar ' + bar);
		recurse();

		// HEURISTIC RE-RUN
		while (solutions.length < 50 && bar > 0) {
			bar = thresholds[++level];
			stack = [];
			table = [0, 0, 0, 0, 0];
			solutions = [];
			index = 0;
			count = 0;
			console.log('repeating with bar ' + bar);
			recurse();
		}

		// SORT SOLUTIONS
		solutions.sort(function(a, b) {
			return a.score - b.score;
		});

		//print(solutions[solutions.length - 1]);
		//print(solutions);
		//console.log('max perms ' + maxperm);
		//console.log('con-free perms ' + count);
		//console.log('solutions ' + solutions.length);
		$('#info-text').text(`${count} conflict-free timetables out of ${maxperm} total permutations.`);
		return count;
		
		
		// ------------------------------------------------------//
		function recurse() {
			if (index === master.length) {
				snapshot();
				return
			}
			for (let i = 0; i < master[index].length; i++) {
				stack.push(master[index][i]);
				if (isConflict()) {
					stack.pop();
				} else {
					addToTable();
					index += 1;
					recurse();
					index -= 1;
					removeFromTable();
					stack.pop();
				}
			}
			return;
		}

		function snapshot() {
			count++;
			// compute score
			let score = 1;
			let total = 0;
			for (let i = 0; i < 5; i++) {
				if (table[i] === 0) {
					score++;
				} else {
					total += Math.log(table[i]);
				}
			}
			//console.log(total / (5 - score) / 28);
			//timePref is used to swtch between early classes and late classes
			score +=	timePref * ((total / (5 - score)) / 28);
			
			// test bar
			if (score < bar)
				return;

			// push to solutions
			let slots = [];
			for (let i = 0; i < stack.length; i++) {
				for (let j = 0; j < stack[i].timeslots.length; j++) {
					let obj = stack[i].timeslots[j];
					slots.push({
						id: obj.id,
						day: obj.day,
						start: obj.start,
						len: obj.len,
						str1: obj.str1,
						str2: obj.str2
					});
				}
			}
			solutions.push({
				score,
				slots
			});
		}

		function isConflict() {
			let section = stack[stack.length - 1];
			for (let j = 0; j < section.timeslots.length; j++) {
				if ((table[section.timeslots[j].day] & section.timeslots[j].timebit) > 0) {
					return true;
				}
			}
			return false;
		}

		function addToTable() {
			let section = stack[stack.length - 1];
			for (let j = 0; j < section.timeslots.length; j++) {
				table[section.timeslots[j].day] = table[section.timeslots[j].day] ^ section.timeslots[j].timebit;
			}
		}

		function removeFromTable() {
			let section = stack[stack.length - 1];
			for (let j = 0; j < section.timeslots.length; j++) {
				table[section.timeslots[j].day] = (~section.timeslots[j].timebit) & table[section.timeslots[j].day];
			}
		}
	}

	function makeTimetables() {
		const time_text = ["8:00 am", "8:30 am", "9:00 am", "9:30 am", "10:00 am", "10:30 am", "11:00 am", "11:30 am", "12:00 pm", "12:30 pm", "1:00 pm", "1:30 pm", "2:00 pm", "2:30 pm", "3:00 pm", "3:30 pm", "4:00 pm", "4:30 pm", "5:00 pm", "5:30 pm", "6:00 pm", "6:30 pm", "7:00 pm", "7:30 pm", "8:00 pm", "8:30 pm", "9:00 pm", "9:30 pm", "10:00 pm"];
		console.log('making tt');
		// generate table
		let counter = 0;
		while (counter < 10 && solutions.length > 0) {
			let current = solutions.pop()
			let index = solutions.length;
			$('#timetable-div').append(table_template({
				id: index
			}));
			
			// insert rows and time column
			for (let i = 0; i < 28; i++) {
				$(`table[data-id=${index}] > tbody`).append(row_template({
					time: time_text[i],
					rowindex: i,
					index: index
				}));
			}
			current.slots.forEach(function(slot){
				let row = slot.start + i
				//get integer quotient of len/2 to adjust text to middle
				let quotient = ((slot.len)/2 | 0) - 1;
				for (let i = 0; i < slot.len; i++){
					$cell = $(`#ttr-${index}-${slot.start+i} td:nth-child(${slot.day+2})`);
					$cell.css('border-top', 'none');
					$cell.css('border-bottom', 'none');
					
					// Display slot text
					if (i === 0)
						$cell.css('border-top', '1px solid black');
					if (i === (0 + quotient))
						$cell.text(slot.str1);
					else if (i == (1 + quotient))
						$cell.text(slot.str2);
					else
						$cell.text(" ");
					
					$cell.css('background-color', "rgb("+(255-(slot.id%11*20))+","+(255-(slot.id%7*20))+","+(255-(slot.id%5*20))+")");
				}
			})
			
			//print(current);
			counter++;
		}
		if (solutions.length > 0)
			$('#more').show();
		
	}

}); //end of document.ready

function checkboxChange(elem) {
	$elem = $(elem);
	var index = ($elem.closest('li').index());
	var mid = $elem.closest('td').attr('mid');
	var sid = $elem.attr('sid');

	var value = $elem.is(':checked') ? false : true;
	course_selc[index].components[mid].sections[sid]["disabled"] = value;

	//print(course_selc));

}

/*
function print(obj) {
	console.log(JSON.stringify(obj));
}
*/
