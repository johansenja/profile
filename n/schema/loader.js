const textBox = document.getElementById('textBox');
const submit = document.getElementById('submit');
const schemaArea = document.querySelector('.schema-area');

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
        tBody.insertAdjacentHTML('beforeend', row(rows[j]));
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

  return `<table class='draggable' id='${name}'>\
            ${tableHead(name)}\
            <tbody id='${name}Body'>\
              <tr class=${type ? type.replace(',', '') : 'integer'}>\
                <td>\
                  id
                </td>\
              </tr>\
            </tbody>\
          </table>`;
};

const row = (wholeThing) => {
  var type = wholeThing.match(/t\.\w*/)[0].substr(2);
  var rowName = wholeThing.match(/".*"/)[0].replace(/"/g, '');

  return `<tr${wholeThing.match(/null: false/) ? " class='no-null'" : ' '}'>\
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
    document.getElementById(tableName).querySelector('.' + columnName).innerHTML += '*'
  };
};

const pdfGenerator = () => {
  var doc = new jsPDF({
    orientation: 'landscape',
    unit: 'in',
    format: [4, 2]
  })

  doc.text('Hello world!', 1, 1)
  doc.save('two-by-four.pdf')
};
