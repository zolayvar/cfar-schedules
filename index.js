Array.max = function( array ){
    return Math.max.apply( Math, array );
};

var getPageWidth = function() {
	//return $(window).width();
	return 800;
};

var getPageHeight = function() {
	return getPageWidth() * (11/8.5);
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
	return ['Upstairs', 'Basement', 'Main floor', 'Sunroom'].slice(0, num);
};

var getCanvas = function() {
	//return new Snap(getPageWidth(), getPageHeight() * 4);
	return new Raphael(0, 0, getPageWidth(), getPageHeight() * 4);
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

var getRoomWidth = function() {
	return getPageWidth()/400 * 68;
}

var getRoomHeight = function() {
	return getRoomFontSize() + 6;
}

var getBodyStartX = function() {
	return getEndOfBlueBar();
}

var getBodyStartY = function(dayNumber) {
	return (getPageWidth()/400) * 97 + dayNumber * getPageHeight();
}

var getBodyWidth = function() {
	return getPageWidth() - getBodyStartX();
}

var getRoomFontSize = function() {
	return getPageWidth()/400 * 13;
}

var getRoomHeadersExtraSpacer = function() {
	return getPageWidth()/400 * 65;
}

var getClassRowHeight = function() {
	return getPageWidth()/400 * 25;
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
	return getClassRowHeight();
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
	return cell.indexOf('Class change (5m)') != -1;
}

var getMealTextStartX = function() {
	return getPageWidth()/400 * 90;
}

var getXColCoord = function(numCols, whichCol) {
	var spacerWidth = (getBodyWidth() - numCols*getRoomWidth()) / (numCols + 1);
	return getBodyStartX() + getRoomWidth()/2 + (spacerWidth)*(whichCol + 1) + getRoomWidth() * whichCol;
}

var drawBackground = function(canvas) {
	canvas.image('thursday.png', 0, 0, getPageWidth(), getPageHeight());
	canvas.image('friday.png', 0, getPageHeight(), getPageWidth(), getPageHeight());
	canvas.image('saturday.png', 0, getPageHeight() * 2, getPageWidth(), getPageHeight());
	canvas.image('sunday.png', 0, getPageHeight() * 3, getPageWidth(), getPageHeight());
};

var drawRoomHeader = function(canvas, x, text, dayNumber) {
	drawFaintOrangeRect(canvas, x - getRoomWidth()/2, getBodyStartY(dayNumber), getRoomWidth(), getRoomHeight());
	var text = canvas.text(x, getBodyStartY(dayNumber) + getRoomHeight()/2, text);
	text.attr({fill: 'white', 'font-weight': '500', 'font-size': getRoomFontSize()})
}

var drawRoomHeaders = function(canvas, num, dayNumber) {
	for (var i = 0; i < num; i++) {
		drawRoomHeader(canvas, getXColCoord(num, i), getRooms(num)[i], dayNumber);
	}
}

var drawFaintOrangeRect = function(canvas, x, y, w, h) {
	canvas.rect(x, y, w, h).attr({fill: 'orange', stroke: 'none'});
}

var drawRowTime = function(canvas, row, cursor) {
	var cursor = row.type == 'lunch' ? cursor + getTimeLabelSpacer()*.5 : cursor;
	var color = getTimeColor(row);

	// First, draw the start time.
	canvas.text(getTimeLabelEndX(), cursor + getTimeLabelSpacer() + getTimeStartFontSize()/2, row.timeStart)
		.attr({fill: color, 'text-anchor': 'end', 'font-weight': '600', 'font-size': getTimeStartFontSize()});

	if (!row.timeEnd) {return}

	// Then, draw the end time.
	canvas.text(getTimeLabelEndX(), cursor + getTimeLabelSpacer() + getTimeStartFontSize() + getTimeEndFontSize()/2, '- ' + row.timeEnd)
		.attr({fill: color, 'text-anchor': 'end', 'font-weight': '600', 'font-size': getTimeEndFontSize(), opacity: '.7'});
}

var drawMealText = function(canvas, row, cursor, numCols) {
	canvas.text(getMealTextStartX(), cursor + getRowHeight(row)/2, row.specialText.toUpperCase())
		.attr({fill: 'white', 'font-weight': '700', 'font-size': getMealTextFontSize(), 'text-anchor': 'start'});
}

var getRowHeight = function(row) {
	if (row.type == 'break') {
		return getBreakRowHeight();
	} else if (row.type == 'class') {
		return getClassRowHeight();
	} else if (row.type == 'lunch') {
		return  getLunchRowHeight();
	} else if (row.type == 'dinner') {
		return getDinnerRowHeight();
	} else if (row.type == '5MinClassChange') {
		return get5MinClassChangeHeight();
	}
	console.log('unknown row height');
}

var drawClassName = function(canvas, classTitle, teacher, cursorY, xCoord) {
	var centerY = cursorY + getClassRowHeight()/2;

	// Draw the pulsing blue light
	canvas.circle(xCoord, centerY, getClassNameFontSize()*1.2)
		.attr({fill: 'rlightblue-white', stroke: 'none', opacity: .5});

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
	canvas.text(xCoord, centerY - getClassNameFontSize()/2, classTitle)
		.attr({'font-weight': '600', 'font-size': getClassNameFontSize()});

	// Draw the teacher name
	canvas.text(xCoord, centerY + getTeacherFontSize()/2 + (linebroke ? getClassNameFontSize()*.75 : 0), teacher)
		.attr({'font-weight': '600', 'font-size': getTeacherFontSize(), opacity: '.7'});
};

var drawClassNames = function(canvas, row, cursor, numCols) {
	for (var i = 0; i < row.classes.length; i++) {
		var classData = row.classes[i];
		var className = classData.split('(')[0].trim();
		var teacher = classData.indexOf('(') == -1 ? '' : classData.split('(')[1].split(')')[0].trim();
		drawClassName(canvas, className, teacher, cursor, getXColCoord(numCols, i));
	}
}

var drawScheduleRow = function(canvas, row, cursor, numCols) {
	console.log(row);
	if (row.type == 'break') {
		drawFaintOrangeRect(canvas, getStartOfBlueBar(), cursor, getBlueBarWidth(), getBreakRowHeight());
	} else if (row.type == 'class') {
		drawRowTime(canvas, row, cursor);
		drawClassNames(canvas, row, cursor, numCols);
	} else if (row.type == 'lunch') {
		drawFaintOrangeRect(canvas, getStartOfBlueBar(), cursor, getLunchWidth(), getLunchRowHeight());
		drawMealText(canvas, row, cursor, numCols);
		drawRowTime(canvas, row, cursor);
	} else if (row.type == 'dinner') {
		drawFaintOrangeRect(canvas, getStartOfBlueBar(), cursor, getDinnerWidth(), getDinnerRowHeight());
		drawMealText(canvas, row, cursor, numCols);
		drawRowTime(canvas, row, cursor);
	} else if (row.type == '5MinClassChange') {
		drawFaintOrangeRect(canvas, getStartOfBlueBar(), cursor, getBlueBarWidth(), get5MinClassChangeHeight());
	}

	return cursor + getRowHeight(row)
}

var drawMasterScheduleDay = function(canvas, masterDaySchedule, dayNumber) {
	// First, draw the room names
	drawRoomHeaders(canvas, 4, dayNumber);


	// Then, draw things by row
	var cursor = getBodyStartY(dayNumber) + getRoomHeight() + getSpacerHeightBetweenRoomHeadersAndFirstClass();
	for (var i = 0; i < masterDaySchedule.length; i++) {
		cursor = drawScheduleRow(canvas, masterDaySchedule[i], cursor, 4);
	}
}

var drawMasterSchedule = function(canvas, masterSchedule) {
	drawMasterScheduleDay(canvas, masterSchedule.thursday, 0);
	drawMasterScheduleDay(canvas, masterSchedule.friday, 1);
	drawMasterScheduleDay(canvas, masterSchedule.saturday, 2);
	drawMasterScheduleDay(canvas, masterSchedule.sunday, 3);
};

var loadCSV = function(canvas) {
	$.ajax({
		type: "GET",
		url: "master_schedule.csv",
		dataType: "text",
		success: function(data) {
			var scheduleCSVObject = $.csv.toObjects(data);
			var masterSchedule = getMasterSchedule(scheduleCSVObject);
			drawMasterSchedule(canvas, masterSchedule);
		}
	});
};

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

			if (isBreak(cell1)) {
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
			}

			daySchedule.push(scheduleItem);
		}
		if (is5MinClassChange(cell1)) {
			scheduleItem = {
				type: '5MinClassChange'
			}
			daySchedule.push(scheduleItem);
		}
		
		row++;
		if (scheduleItem) {
			lastLastScheduleItem = lastScheduleItem;
			lastScheduleItem = scheduleItem;
		}
	}

	return daySchedule;
}

var getMasterSchedule = function(scheduleCSVObject) {
	var schedule = {
		'thursday': readOffDay(scheduleCSVObject, 'Thu', 'Fri'), 
		'friday': readOffDay(scheduleCSVObject, 'Fri', 'Sat'), 
		'saturday': readOffDay(scheduleCSVObject, 'Sat', 'Sun'), 
		'sunday': readOffDay(scheduleCSVObject, 'Sun', 'the end of the file')
	};

	return schedule;
};

$(function () {
    var canvas = getCanvas();
    drawBackground(canvas);

    loadCSV(canvas);
});