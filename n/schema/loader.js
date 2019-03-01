const textBox = document.getElementById('textBox');
const submit = document.getElementById('submit');
const schemaArea = document.querySelector('.schema-area');
const schemaAreaSVG = document.getElementById('svg1');
const resetButton = document.getElementById('reset-button');
const foreignKeys = {};

resetButton.addEventListener('click', (event) => {
  event.preventDefault;
  schemaAreaSVG.innerHTML = '';
});

submit.addEventListener('click', (event) => {
  event.preventDefault();
  var schema = textBox.value;
  tables = findTables(schema);

  for (var i = 0; i <= tables.length - 1; i++) {
    var match = tables[i].match(/".*"/);
    var customId = tables[i].match(/id: :[^,]*,/);
    var tableName = match[0].replace(/"/g, '');
    schemaArea.insertAdjacentHTML('beforeend', table(tableName, customId, (i % 8) + 1, Math.ceil(i / 8)));

    var tBody = document.getElementById(`${tableName}Body`);
    var rows = tables[i].match(/t\..*[^\n]*/g);
    for (var j = 0; j <= rows.length - 1; j++) {
      if (rows[j].substr(0,7) !== 't.index') {
        tBody.insertAdjacentHTML('beforeend', row(rows[j], tableName));
      } else {
        createIndex(rows[j], tableName);
      };
    };
  };
  connectAll();
});


const findTables = (schema) => {
  const tablesRegex = /create_table (((?!end).*)*\s*)*end/g;
  return schema.match(tablesRegex);
};

const table = (name, customId, colNum, rowNum) => {
  if (customId) {
    var type = customId[0].replace(/id: :/, '')
  };

  return `<table class='draggable' id='${name}' style='grid-column: ${colNum} / span 1; grid-row: 1 / span '>\
            ${tableHead(name)}\
            <tbody id='${name}Body'>\
              <tr class=${type ? type.replace(',', '') : 'integer'} id='${name}Id'>\
                <td>\
                  id
                </td>\
              </tr>\
            </tbody>\
          </table>`;
};

const row = (wholeThing, tableName) => {
  var type = wholeThing.match(/t\.\w*/)[0].substr(2);
  var rowName = wholeThing.match(/".*"/)[0].replace(/"/g, '');

  return `<tr${wholeThing.match(/null: false/) ? " class='no-null'" : ''} id='${rowName + tableName}'>\
            <td class='${rowName} ${type}'>\
              ${wholeThing.match(/array: true/) ? rowName + '   = [ ]' : rowName}\
            </td>\
          </tr>`;
};

const tableHead = (name) => {
  return `<thead>\
            <tr>\
              <th>\
                ${name}\
              </th>\
            </tr>\
          </thead>`
};

const createIndex = (row, tableName) => {
  const columnName = row.match(/\[".*"\]/)[0].replace(/\W/g, '');

  if (document.getElementById(tableName).querySelector('.' + columnName)) {
    // schemaAreaSVG.innerHTML += `<path id="${columnName + tableName}path"\
    //                                   d="M0 0"\
    //                                   stroke-width="0.15em"\
    //                                   style="stroke:${'#'+Math.floor(Math.random()*16777215).toString(16)}; fill:none; "/>`
    // foreignKeys[columnName] = tableName
    schemaAreaSVG.innerHTML += '*'
  };
};

// Foreign keys
//helper functions, it turned out chrome doesn't support Math.sgn()
function signum(x) {
    return (x < 0) ? -1 : 1;
}
function absolute(x) {
    return (x < 0) ? -x : x;
}

Array.min = function( array ){
    return Math.min.apply( Math, array );
};

function drawPath(svg, path, startX, startY, endX, endY, side) {
    // get the path's stroke width (if one wanted to be  really precize, one could use half the stroke size)
    var stroke =  parseFloat(path.attr("stroke-width"));
    // check if the svg is big enough to draw the path, if not, set heigh/width
    if (svg.attr("height") <  endY)                 svg.attr("height", endY);
    if (svg.attr("width" ) < (startX + stroke) )    svg.attr("width", (startX + stroke));
    if (svg.attr("width" ) < (endX   + stroke) )    svg.attr("width", (endX   + stroke));

    var deltaX = (endX - startX) * 0.15;
    var deltaY = (endY - startY) * 0.15;
    // for further calculations which ever is the shortest distance
    var delta  =  deltaY < absolute(deltaX) ? deltaY : absolute(deltaX);

    // set sweep-flag (counter/clock-wise)
    // if start element is closer to the left edge,
    // draw the first arc counter-clockwise, and the second one clock-wise
    var arc1 = 0; var arc2 = 1;
    if (startX > endX) {
        arc1 = 1;
        arc2 = 0;
    }
    // draw tha pipe-like path
    // 1. move a bit down, 2. arch,  3. move a bit to the right, 4.arch, 5. move down to the end
    path.attr("d",  "M"  + startX + " " + startY +
                    ` H${side === 'left' ? '-' : '' }` + (endX - -startX)*0.5 +
                    " V" + (startY + delta + endY) +
                    ` H${side === 'left' ? '-' : '' }` + (endX - -startX)*0.5
                    // " A" + delta + " " +  delta + " 0 0 " + arc1 + " " + (startX + delta*signum(deltaX)) + " " + (startY + 2*delta) +
                    // " H" + (endX - delta*signum(deltaX)) +
                    // " A" + delta + " " +  delta + " 0 0 " + arc2 + " " + endX + " " + (startY + 3*delta) +
                    // " V" + endY );
                    )
}

const connectAll = () => {
  for (var key in foreignKeys) {
    var end = `#${key.replace('_id', '')}sId`
    if (end[end.length - 4] === 'y') {
      end = `#${key.replace('y_id', '')}iesId`
    };

    connectElements($(`#svg1`), $(`#${key + foreignKeys[key]}path`), $(`#${key + foreignKeys[key]}`), $(end));
  }
};

function connectElements(svg, path, startElem, endElem) {
    var svgContainer= $("#svgContainer");

    if (!Object.keys(endElem).length) {
      startElem.innerHTML += '*'
      return
    }

    // if first element is lower than the second, swap!
    if(startElem.offset().top > endElem.offset().top){
        var temp = startElem;
        startElem = endElem;
        endElem = temp;
    }

    // get (top, left) corner coordinates of the svg container
    var svgTop  = svgContainer.offset().top;
    var svgLeft = svgContainer.offset().left;

    // get (top, left) coordinates for the two elements
    var startCoord = startElem.offset();
    var endCoord   = endElem.offset();

    // calculate path's start (x,y)  coords
    // we want the x coordinate to visually result in the element's mid point
    var startRightX = startCoord.left + startElem.outerWidth() - svgLeft;    // x = left offset + 0.5*width - svg's left offset
    var startLeftX = startCoord.left - startElem.outerWidth() - svgLeft;    // x = left offset + 0.5*width - svg's left offset
    var startY = startCoord.top  + 0.5*startElem.outerHeight() - svgTop;        // y = top offset + height - svg's top offset

        // calculate path's end (x,y) coords
    var endRightX = endCoord.left + endElem.outerWidth() - svgLeft;
    var endLeftX = endCoord.left - endElem.outerWidth() - svgLeft;
    var endY = endCoord.top - 0.85*svgTop;
    var xs = {}

    xs[absolute(startRightX - endRightX)] = [startRightX, endRightX]
    xs[absolute(startRightX - endLeftX)] = [startRightX, endLeftX]
    xs[absolute(startLeftX - endLeftX)] = [startLeftX, endLeftX]
    xs[absolute(startLeftX - endRightX)] = [startLeftX, endRightX]

    var startEndX = xs[Array.min(Object.keys(xs))]

    // call function for drawing the path
    drawPath(svg, path, startEndX[0], startY, startEndX[1], endY, 'hi' );

}

$(window).resize(function() {
    if (schemaAreaSVG.innerHTML !== '') {
      $("#svg1").attr("height", "0");
      $("#svg1").attr("width", "0");
      connectAll();
    }
});
