Array.max = function( array ){
    return Math.max.apply( Math, array );
};

var getPageWidth = function() {
	//return $(window).width();
	return 1085; // for some reason this causes it to exactly fit a piece of pdf paper
};

var getPageHeight = function() {
	return getPageWidth()/1085 * 1404;
};

var getStartOfBlueBar = function() {
	return getPageWidth()/400 * 35;
}

var getEndOfBlueBar = function() {
	return (70/400) * getPageWidth();
}

var getBlueBarWidth = function() {
	return getEndOfBlueBar() - getStartOfBlueBar();
}

var getRooms = function(num) {
	return getRoomNames().slice(0, num);
};

var getCanvas = function() {
	//return new Snap(getPageWidth(), getPageHeight() * 4);
	return new Raphael(0, 0, getPageWidth(), getPageHeight() * 4 * 36);
};

var isntParticipant = function(cell) {
	// Participant cells look like 'PX'
	return !((cell.charAt(0) == 'P') && (cell.length == 2));
};

var isClassName = function(cell) {
	return cell && isntParticipant(cell) && (cell.indexOf('Understudy:') == -1) && !isBreak(cell);
};

var isBreak = function(cell) {
	return cell == 'Break';
}

var isLunch = function(cell) {
	return cell.indexOf('Lunch') != -1;
}

var isDinner = function(cell) {
	return cell.indexOf('Dinner') != -1;
}

var isTutoringWheel = function(row) {
	return row.classes[0].split('(')[0].trim() == "Tutoring Wheel";
}

var getRoomWidth = function() {
	return getPageWidth()/400 * 68;
}

var getRoomHeight = function() {
	return getRoomFontSize() + 6;
}

var getBodyStartX = function() {
	return getEndOfBlueBar();
}

var getBodyStartY = function(dayNumber, participantNumber) {
	return (getPageWidth()/400) * 97 + dayNumber * getPageHeight() + (getDays().length * getPageHeight() * participantNumber);
}

var getBodyWidth = function() {
	return getPageWidth() - getBodyStartX();
}

var getRoomFontSize = function() {
	return getPageWidth()/1085 * 32;
}

var getRoomHeadersExtraSpacer = function() {
	return getPageWidth()/400 * 65;
}

var getBreakRowHeight = function() {
	return getPageWidth()/400 * 4;
}

var get5MinClassChangeHeight = function() {
	return getPageWidth()/400 *1;
}

var getLunchRowHeight = function() {
	return getPageWidth()/400 * 32;
}

var getDinnerRowHeight = function() {
	return getPageWidth()/400 * 25;
}

var getLunchWidth = function() {
	return getBlueBarWidth() + getBodyWidth();
}

var getDinnerWidth = function() {
	return getLunchWidth();
}

var getSpacerHeightBetweenRoomHeadersAndFirstClass = function() {
	return getBreakRowHeight()/2;
}

var getTimeLabelEndX = function() {
	return getEndOfBlueBar() - getBreakRowHeight();
}

var getTimeLabelSpacer = function() {
	return getBreakRowHeight();
}

var getTimeStartFontSize = function() {
	return getPageWidth()/400 * 10;
}

var getTimeEndFontSize = function() {
	return getPageWidth()/400 * 6;
}

var getMealTextFontSize = function() {
	return getPageWidth()/400 * 13;
}

var getTimeColor = function(row) {
	return row.type == 'class' ? 'black' : 'white';
}

var getClassNameFontSize = function() {
	return getPageWidth()/400 * 7.5;
}

var getTeacherFontSize = function() {
	return getPageWidth()/400 * 6;
}

var is5MinClassChange = function(cell) {
	return cell.indexOf('Class change (5m)') != -1 ||
		cell.indexOf('Break (5m)') != -1;
}

var getMealTextStartX = function() {
	return getPageWidth()/400 * 90;
}

var getXColCoord = function(numCols, whichCol) {
	var spacerWidth = (getBodyWidth() - numCols*getRoomWidth()) / (numCols + 1);
	return getBodyStartX() + getRoomWidth()/2 + (spacerWidth)*(whichCol + 1) + getRoomWidth() * whichCol;
}

var drawBackground = function(canvas, participantNumber) {
	var days = getDays();
	var backgroundImages = [];
	for(var i = 0; i < days.length; i++) {
		var yStart = participantNumber * days.length * getPageHeight() + getPageHeight() * i;
		var background = canvas.image(days[i]+'.png', 0, yStart, getPageWidth(), getPageHeight());
		backgroundImages.push(background);
	}
	return backgroundImages;
};

var drawRoomHeader = function(canvas, x, text, dayNumber, participantNumber) {
	drawFaintOrangeRect(canvas, x - getRoomWidth()/2, getBodyStartY(dayNumber, participantNumber), getRoomWidth(), getRoomHeight());
	var text = canvas.text(x, getBodyStartY(dayNumber, participantNumber) + getRoomHeight()/2, text);
	text.attr({fill: 'white', 'font-weight': 'bold', 'font-size': getRoomFontSize()})//, 'font-family': 'Arial, sans-serif'})
}

var drawRoomHeaders = function(canvas, num, dayNumber, participantNumber) {
	for (var i = 0; i < num; i++) {
		drawRoomHeader(canvas, getXColCoord(num, i), getRooms(num)[i], dayNumber, participantNumber);
	}
}

var drawFaintOrangeRect = function(canvas, x, y, w, h) {
	canvas.rect(x, y, w, h).attr({fill: '#fbbc75', stroke: 'none'});
}

var drawRowTime = function(canvas, row, cursor, dayNumber) {
	var cursor = row.type == 'lunch' ? cursor + getTimeLabelSpacer()*.75 : cursor;
	var centerY = cursor + getRowHeight(row, dayNumber)/2;
	var color = getTimeColor(row);

	// First, draw the start time.
	var startTimeY = row.timeEnd ? centerY - getTimeStartFontSize()*.3 : centerY;
	canvas.text(getTimeLabelEndX(), startTimeY, row.timeStart)
		.attr({fill: color, 'text-anchor': 'end', 'font-weight': '600', 'font-size': getTimeStartFontSize()});

	if (!row.timeEnd) {return}

	// Then, draw the end time.
	canvas.text(getTimeLabelEndX(), centerY + getTimeEndFontSize()*.7, '- ' + row.timeEnd)
		.attr({fill: color, 'text-anchor': 'end', 'font-weight': '600', 'font-size': getTimeEndFontSize(), opacity: (color == 'white' ? '1' :'.5')});
}

var drawMealText = function(canvas, row, cursor, dayNumber) {
	canvas.text(getMealTextStartX(), cursor + getRowHeight(row, dayNumber)/2, row.specialText.toUpperCase())
		.attr({fill: 'white', 'font-weight': '700', 'font-size': getMealTextFontSize(), 'text-anchor': 'start'});
}

var getRowHeight = function(row, dayNumber) {
	if (row.type == 'break') {
		return getBreakRowHeight();
	} else if (row.type == 'class' && isTutoringWheel(row)) {
		return getClassRowHeight(dayNumber) + 150;
	} else if (row.type == 'class') {
		return getClassRowHeight(dayNumber);
	} else if (row.type == 'lunch') {
		return  getLunchRowHeight();
	} else if (row.type == 'dinner') {
		return getDinnerRowHeight();
	} else if (row.type == '5MinClassChange') {
		return get5MinClassChangeHeight();
	}
	console.log('unknown row height', row);
}

var drawClassName = function(canvas, classTitle, teacher, cursorY, xCoord, blobPredecessorPosition, isForParticipantSchedule, dayNumber) {
	if (classTitle == 'nothing to see here') {
		return;
	}

	var centerY = cursorY + getClassRowHeight(dayNumber)/2;

	// Draw the pulsing blue light
	if (blobPredecessorPosition) {
		if (classTitle != '') {
			canvas.path('M' + blobPredecessorPosition.x + ',' + blobPredecessorPosition.y + 'L' + xCoord + ',' + centerY)
				.attr({stroke: '#c1f1fa', 'stroke-width': '15'}).toBack();
		}
		blobPredecessorPosition.x = xCoord;
		blobPredecessorPosition.y = centerY;
	}	

	// if it's the tutoring wheel, draw an extra blue dot and a swoosh connecting them
	if (classTitle == "Tutoring Wheel") {
		swoosh = canvas.image('swoosh.png', xCoord, centerY - 10, 650, 170).toFront();
		canvas.circle(xCoord, centerY+150, getClassNameFontSize()*1.2)
			.attr({fill: '#c1f1fa', stroke: 'none'});
		blobPredecessorPosition.x = xCoord;
		blobPredecessorPosition.y = centerY+170;
	}

	canvas.circle(xCoord, centerY, getClassNameFontSize()*1.2)
		.attr({fill: '#c1f1fa', stroke: 'none'}).toFront();

	// Draw the class name
	var linebroke = false;
	if (classTitle.length > 23) {
		linebroke = true;
		// Look for the space closest to the middle of the name
		for (var i = 0; i < classTitle.length/2; i++) {
			if (classTitle.charAt(classTitle.length/2 + i) == ' ') {
				classTitle = classTitle.substr(0, classTitle.length/2 + i) + '\n' + classTitle.substr(classTitle.length/2 + i + 1);
				break;
			}
			if (classTitle.charAt(classTitle.length/2 - i) == ' ') {
				classTitle = classTitle.substr(0, classTitle.length/2 - i) + '\n' + classTitle.substr(classTitle.length/2 - i + 1);
				break;
			}
		}
	}
	var classNameY = isForParticipantSchedule ? centerY : centerY - getClassNameFontSize()/2;
	canvas.text(xCoord, classNameY, classTitle)
		.attr({'font-weight': '600', 'font-size': getClassNameFontSize()}).toFront();

	// Draw the teacher name
	if (!isForParticipantSchedule) {
		canvas.text(xCoord, centerY + getTeacherFontSize()/2 + (linebroke ? getClassNameFontSize()*.75 : 0), teacher)
			.attr({'font-weight': '600', 'font-size': getTeacherFontSize(), opacity: '.7'}).toFront();
	}
};

var drawClassNames = function(canvas, row, cursor, blobPredecessorPosition, isForParticipantSchedule, dayNumber) {
	if (isForParticipantSchedule && !isTutoringWheel(row) && row.participantInRoomNum == undefined) {
		return;
	}
	for (var i = 0; i < row.classes.length; i++) {
		if (row.participantInRoomNum >= 0 && i != row.participantInRoomNum) {
			continue;
		}
		var classData = row.classes[i];
		var className = classData.split('(')[0].trim();
		var teacher = classData.indexOf('(') == -1 ? '' : classData.split('(')[1].split(')')[0].trim();
		drawClassName(canvas, className, teacher, cursor, getXColCoord(4, i), blobPredecessorPosition, isForParticipantSchedule, dayNumber);
	}
}

var drawScheduleRow = function(canvas, row, cursor, blobPredecessorPosition, isForParticipantSchedule, dayNumber) {
	console.log(row);
	if (row.type == 'break') {
		drawFaintOrangeRect(canvas, getStartOfBlueBar(), cursor, getBlueBarWidth(), getBreakRowHeight());
	} else if (row.type == 'class') {
		drawRowTime(canvas, row, cursor, dayNumber);
		drawClassNames(canvas, row, cursor, blobPredecessorPosition, isForParticipantSchedule, dayNumber);
	} else if (row.type == 'lunch') {
		canvas.image('mealbar.png', getStartOfBlueBar(), cursor, getLunchWidth(), getLunchRowHeight());
		drawMealText(canvas, row, cursor);
		drawRowTime(canvas, row, cursor, dayNumber);
	} else if (row.type == 'dinner') {
		var barWidth = row.specialText.indexOf('fterparty') > -1 ? getDinnerWidth()*.8 : getDinnerWidth();
		canvas.image('mealbar.png', getStartOfBlueBar(), cursor, barWidth, getDinnerRowHeight())
		drawMealText(canvas, row, cursor);
		drawRowTime(canvas, row, cursor, dayNumber);
	} else if (row.type == '5MinClassChange') {
		drawFaintOrangeRect(canvas, getStartOfBlueBar(), cursor, getBlueBarWidth(), get5MinClassChangeHeight());
	}

	return cursor + getRowHeight(row, dayNumber);
}

var drawParticipantScheduleRow = function(canvas, row, cursor, blobPredecessorPosition, dayNumber) {
	return drawScheduleRow(canvas, row, cursor, blobPredecessorPosition, true, dayNumber);
}

var drawAllRoomHeaders = function(canvas, participantNumber) {
	for (var dayNumber = 0; dayNumber < getDays().length; dayNumber++) {
		drawRoomHeaders(canvas, 4, dayNumber, participantNumber);
	}
}

var drawMasterScheduleDay = function(canvas, masterDaySchedule, dayNumber) {
	var cursor = getBodyStartY(dayNumber, 0) + getRoomHeight() + getSpacerHeightBetweenRoomHeadersAndFirstClass();
	for (var i = 0; i < masterDaySchedule.length; i++) {
		cursor = drawScheduleRow(canvas, masterDaySchedule[i], cursor, 0, false, dayNumber);
	}
}

var drawMasterSchedule = function(canvas, masterSchedule) {
	// Draw all the backgrounds
	drawBackground(canvas, 0);

	// Draw all the room names
	drawAllRoomHeaders(canvas, 0);

	// Then draw everything else
	for(var i = 0; i < masterSchedule.length; i++) {
		drawMasterScheduleDay(canvas, masterSchedule[i], i);
	}
};

var drawParticipantScheduleDay = function(canvas, participantScheduleDay, dayNumber, participantNumber) {
	var cursor = getBodyStartY(dayNumber, participantNumber) + getRoomHeight() + getSpacerHeightBetweenRoomHeadersAndFirstClass();
	var blobPredecessorPosition = {
		x: getStartOfBlueBar() + getBlueBarWidth()/2, 
		y: cursor + getClassRowHeight(dayNumber)/2
	};
	for (var i = 0; i < participantScheduleDay.length; i++) {
		cursor = drawParticipantScheduleRow(canvas, participantScheduleDay[i], cursor, blobPredecessorPosition, dayNumber);
	}
}

var drawParticipantCodes = function(canvas, participantNumber, participantCode) {
	var x = getPageWidth() - 20;
	for (var i = 0; i < getDays().length; i++) {
		var y = (getPageHeight()*getDays().length*participantNumber) + getPageHeight()*i + getPageHeight() - 20 - 30;
		canvas.text(x, y, participantCode + ' ' + (i+1) + '\nMay 2017')
			.attr({'text-anchor': 'end', fill: '#bd7526', 'font-size': '30', 'font-weight': '700'});
	}
}

var drawParticipantSchedule = function(canvas, participantSchedule, participantNumber, participantCode) {
	// Draw all the backgrounds
	var backgroundImages = drawBackground(canvas, participantNumber);

	// Draw all the room names
	drawAllRoomHeaders(canvas, participantNumber);

	// Draw the participant codes
	drawParticipantCodes(canvas, participantNumber, participantCode);

	// Draw everything else
	for(var i = 0; i < participantSchedule.length; i++) {
		drawParticipantScheduleDay(canvas, participantSchedule[i], i, participantNumber);
	}

	// Send the background images to the back
	for(var i = 0; i < backgroundImages.length; i++) {
		backgroundImages[i].toBack();
	}
}

var getParticipantScheduleDay = function(scheduleCSVObject, masterScheduleDay, participantCode) {
	var participantScheduleDay = [];
	for (var i = 0; i < masterScheduleDay.length; i++) {
		var masterScheduleItem = masterScheduleDay[i];
		var copy = Object.assign({}, masterScheduleItem);
		participantScheduleDay.push(copy);
		if (masterScheduleItem.type == 'class') {
			var start = masterScheduleItem.rowNumber;
			var end = i == masterScheduleDay.length - 1 ? scheduleCSVObject.length - 1 : masterScheduleDay[i+1].rowNumber;
			for (var j = start; j < end; j++) {
				for (var column = 0; column < 37; column++) {
					if (scheduleCSVObject[j][column] == participantCode) {
						var roomIndex = Math.floor((column-1)/9);
						participantScheduleDay[participantScheduleDay.length-1].participantInRoomNum = roomIndex;
					}
				}
			}

			// this code exists to handle situations where there's a half-hour rotation against an hour class
			if (participantScheduleDay[participantScheduleDay.length-1].classes[0].split('(')[0].trim() != "Tutoring Wheel" && 
					participantScheduleDay[participantScheduleDay.length-1].participantInRoomNum == undefined) {
				var timeEnd = participantScheduleDay[participantScheduleDay.length-1].timeEnd;
				participantScheduleDay.pop();
				participantScheduleDay.pop();
				participantScheduleDay[participantScheduleDay.length-1].timeEnd = timeEnd;
			}
		}
	}
	return participantScheduleDay;
}

var getParticipantSchedule = function(scheduleCSVObject, masterSchedule, participantCode) {
	participantSchedule = [];
	for(var i = 0; i < masterSchedule.length; i++) {
		participantSchedule.push(
			getParticipantScheduleDay(
				scheduleCSVObject, 
				masterSchedule[i], 
				participantCode))
	}
	return participantSchedule;
}

var readOffDay = function(scheduleCSVObject, dayLabel, stopAt) {
	var row = 0;

	// first, find where this day starts
	for (row; row < scheduleCSVObject.length; row++) {
		if (scheduleCSVObject[row].label == dayLabel) {
			break;
		}
	}
	row++;

	// then, read off all the stuff about this day
	var daySchedule = [];
	var lastScheduleItem;
	var lastLastScheduleItem;
	var lastClassArray = [];
	while (scheduleCSVObject[row] && scheduleCSVObject[row].label != stopAt) {
		var label = scheduleCSVObject[row].label;
		var cell1 = scheduleCSVObject[row]['1'];
		var scheduleItem;

		if (label) {
			scheduleItem = {
				timeStart: label.replace('PM', '').replace('AM', '').trim()
			};
			if (lastScheduleItem) {
				lastScheduleItem.timeEnd = scheduleItem.timeStart;
				if (lastScheduleItem.type == '5MinClassChange') {
					var a = new Date();
					a.setHours(scheduleItem.timeStart.split(':')[0]);
					a.setMinutes(scheduleItem.timeStart.split(':')[1]);
					var tsmillis = a.valueOf();
					var lLSITE = (new Date(tsmillis - 5 * (60000 /* ms/minute */)));
					lastLastScheduleItem.timeEnd = lLSITE.getHours() + ':' + ('0' + lLSITE.getMinutes()).slice(-2);
				}
			}


			if (is5MinClassChange(cell1)) {
				scheduleItem.type = '5MinClassChange';
			} else if (isBreak(cell1)) {
				scheduleItem.type = 'break';
			} else if (isLunch(cell1)) {
				scheduleItem.type = 'lunch';
				scheduleItem.specialText = cell1;
			} else if (isDinner(cell1)) {
				scheduleItem.type = 'dinner';
				scheduleItem.specialText = cell1;
			} else if (isClassName(cell1)) {
				scheduleItem.type = 'class';
				scheduleItem.classes = [
					cell1, 
					scheduleCSVObject[row]['10'], 
					scheduleCSVObject[row]['19'], 
					scheduleCSVObject[row]['28']].filter(isClassName);
				lastClassArray = scheduleItem.classes;
			} else if (!isntParticipant(cell1)) {
				scheduleItem.type = 'class';
				scheduleItem.classes = lastClassArray;
			} else {
				console.log('halp');
			}

			daySchedule.push(scheduleItem);
			scheduleItem.rowNumber = row;
		}
		if (scheduleItem) {
			lastLastScheduleItem = lastScheduleItem;
			lastScheduleItem = scheduleItem;
		}
		
		row++;
	}

	return daySchedule;
}

var getMasterSchedule = function(scheduleCSVObject) {
	var days = getDays();
	days.push('stop codon');
	var schedule = [];
	for(var i = 0; i < days.length-1; i++) {
		schedule.push(readOffDay(scheduleCSVObject, days[i], days[i+1]))
	}

	return schedule;
};

var drawParticipantSchedules = function(canvas, masterSchedule, scheduleCSVObject) {
	var participantCodes = getParticipantCodes();
	
	for (var i = 0; i < participantCodes.length; i++) {
		var participantSchedule = getParticipantSchedule(scheduleCSVObject, masterSchedule, participantCodes[i]);
		drawParticipantSchedule(canvas, participantSchedule, i, participantCodes[i]);
	}
}








////////////////////////////////////////////////////////////////////////////
// BEGIN THINGS THAT SHOULD BE CHANGED TO TAILOR THE CODE TO THE SCHEDULE //
////////////////////////////////////////////////////////////////////////////

// use this function to say what days there are
var getDays = function() {
	// return ['Thu', 'Fri', 'Sat', 'Sun'];
	return ['Mon', 'Tue', 'Wed', 'Thu'];;
}

// use these numbers to stretch or compress a day vertically to make it fit the page
var getClassRowHeight = function(dayNumber) {
	if (dayNumber == 0) {
		return getPageWidth()/400 * 36;
	} else if (dayNumber == 1) {
		return getPageWidth()/400 * 36;
	} else if (dayNumber == 2) {
		return getPageWidth()/400 * 40;
	} else if (dayNumber == 3) {
		return getPageWidth()/400 * 28;
	} else {
		console.log('need a dayNumber for getClassRowHeight');
	}
}

// change this funciton to print out more or less schedules
var getParticipantCodes = function() {
	// return ['PA', 'PB', 'PC', 'PD', 'PE'];

	// return ['PA', 'PB', 'PC', 'PD', 'PE',
	// 		'PI', 'PJ', 'PK', 'PL', 'PM',
	// 		'PQ', 'PR', 'PS', 'PT', 'PU',
	// 		'PY', 'PZ', 'P1', 'P2', 'P3'];

	return "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split('').map(function(char) {
		return 'P' + char;
	});
}

// use this function to name the rooms
var getRoomNames = function() {
	// return ['Upstairs', 'Basement', 'Main floor', 'Sunroom'];
	return ['prague n/1', 'prague n/2', 'prague n/3', 'prague n/4'];
}


//////////////////////////////////////////////////////////////////////////
// END THINGS THAT SHOULD BE CHANGED TO TAILOR THE CODE TO THE SCHEDULE //
//////////////////////////////////////////////////////////////////////////








var loadCSVandDrawEverything = function(canvas) {
	$.ajax({
		type: "GET",
		url: "master_schedule.csv",
		dataType: "text",
		success: function(data) {
			var scheduleCSVObject = $.csv.toObjects(data);
			var masterSchedule = getMasterSchedule(scheduleCSVObject);


			// drawMasterSchedule(canvas, masterSchedule);
			drawParticipantSchedules(canvas, masterSchedule, scheduleCSVObject);
		}
	});
};

$(function () {
    var canvas = getCanvas();
    loadCSVandDrawEverything(canvas);
});