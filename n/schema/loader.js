const textBox = document.getElementById('textBox');
const submit = document.getElementById('submit');
const schemaArea = document.querySelector('.schema-area');
const schemaAreaSVG = document.getElementById('svg1');
const resetButton = document.getElementById('reset-button');
const foreignKeys = {};

resetButton.addEventListener('click', (event) => {
  event.preventDefault;
  schemaArea.innerHTML = '';
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
    schemaArea.insertAdjacentHTML('beforeend', table(tableName, customId));

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
});


const findTables = (schema) => {
  const tablesRegex = /create_table (((?!end).*)*\s*)*end/g;
  return schema.match(tablesRegex);
};

const table = (name, customId) => {
  if (customId) {
    var type = customId[0].replace(/id: :/, '')
  };
  console.log(name)
  return `<table class='draggable' id='${name}'>\
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
  console.log(`#${columnName.replace('_id', '')}sId`)
  if (document.getElementById(tableName).querySelector('.' + columnName)) {
    schemaAreaSVG.innerHTML += `<path id="${columnName + tableName}path"\
                                      d="M0 0"\
                                      stroke-width="0.3em"\
                                      style="stroke:#555; fill:none; "/>`
    connectElements($(`#${columnName + tableName}svg`), $(`#${columnName + tableName}path`), $(`#${columnName + tableName}`), $(`#${columnName.replace('_id', '')}sId`));
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

function drawPath(svg, path, startX, startY, endX, endY) {
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
                    " V" + (startY + delta) +
                    " A" + delta + " " +  delta + " 0 0 " + arc1 + " " + (startX + delta*signum(deltaX)) + " " + (startY + 2*delta) +
                    " H" + (endX - delta*signum(deltaX)) +
                    " A" + delta + " " +  delta + " 0 0 " + arc2 + " " + endX + " " + (startY + 3*delta) +
                    " V" + endY );
}

function connectElements(svg, path, startElem, endElem) {
    var svgContainer= $("#svgContainer");

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
    var startX = startCoord.left + startElem.outerWidth() - svgLeft;    // x = left offset + 0.5*width - svg's left offset
    var startY = startCoord.top  + 0.5*startElem.outerHeight() - svgTop;        // y = top offset + height - svg's top offset

        // calculate path's end (x,y) coords
    var endX = endCoord.left + endElem.outerWidth() - svgLeft;
    var endY = endCoord.top  - 0.5*svgTop;

    // call function for drawing the path
    drawPath(svg, path, startX, startY, endX, endY);

}

// $(window).resize(function () {
//     // reset svg each time
//     $("#svg1").attr("height", "0");
//     $("#svg1").attr("width", "0");
//     connectAll();
// });


// const pdfGenerator = () => {
//   var doc = new jsPDF({
//     orientation: 'landscape',
//     unit: 'in',
//     format: [4, 2]
//   })

//   doc.text('Hello world!', 1, 1)
//   doc.save('two-by-four.pdf')
// };
