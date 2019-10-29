let ticketSelector;
/*  this function returns an object that can be used to easily display data in
the DOM and to check conditions for a bingo game  */
function makeTicket(){
  let initial = 1; // is the first number between 1 and 90
  let counter = 0;

  /* returns an array of length 9, each element of the array contains:
  pool => array of numbers that can be randomly selected
  range => length of the array pool
  counter => indicates how may numbers can be selected
  numbers => array that includes the numbers selected
  positions => array of keys related to array numbers, useful to create ticket rows
   */
  function makeColumns(){
    const columns = [];
    for(let a=0; a<9; a++){
      const column ={};
      column.column = a;
      columns.push(column);
      const pool =[];
      let range;
      if(a===0){
        range = 9;
      } else if(a===8){
        range = 11;
      } else range = 10;
      const final = initial + range;
      for(let b=initial; b<final; b++){
        pool.push(b);
      }
      initial = final;
      column.pool = pool;
      column.counter = 3;
      column.range = range;
      column.numbers =[];
      column.positions =[];
    }
    return columns;
  }
  /* removes a number from column.pool and returns it */
  function makeNumber(column){
    const index = Math.floor(Math.random() * column.range);
    const number = column.pool[index];
    column.counter--;
    column.range--;
    column.pool.splice(index,1);
    return number;
  }
  /* the property position will be useful to create the ticket rows */
  function assignPoistion(){
    let position;
    if(counter<5){
      position = 0;
    } else if(counter<10){
      position = 1;
    } else position = 2;
    counter++;
    return position;
  }
  /* returns an array of length 9 */
  function createIndexArray(){
    return [0,1,2,3,4,5,6,7,8];
  }


  const columns = makeColumns();
  let indexArray = createIndexArray();
  /* this loop selects a random number from each column, 9 in total
  allowing to have in every ticket at least 1 number from each
  column */
  for(let a=0; a<9; a++){
    const index = Math.floor(Math.random() * indexArray.length);
    const number = makeNumber(columns[indexArray[index]]);
    const position = assignPoistion();
    columns[indexArray[index]].numbers.push(number);
    columns[indexArray[index]].positions.push(position);
    indexArray.splice(index,1);
  }
  indexArray = createIndexArray();

  let index;
  /* this loop selects the remaining 6 numbers */
  for(let a=0;a<6;a++){
    /* switches if the column selected has less than 3 numbers already assigned to the tickets
    and also the positionsArray of the column does not already include the new position (*1) */
    let validatorBoolean = true;
    while(validatorBoolean){
      index = Math.floor(Math.random() * indexArray.length);
      if(columns[indexArray[index]].counter>0){
        const number =makeNumber(columns[indexArray[index]]);
        const position = assignPoistion(); // (*1)
        if(!columns[indexArray[index]].positions.includes(position)){
          columns[indexArray[index]].numbers.push(number);
          columns[indexArray[index]].positions.push(position);
          validatorBoolean=!validatorBoolean;
        } else counter--;

      }
    }
  }
  const ticket ={};
  ticket.numbers =[];
  ticket.rows =[[],[],[]];
  columns.forEach(function(column){
    const columnIndex = columns.indexOf(column);
    column.numbers.sort((a,b) => a-b);
    column.positions.sort((a,b) => a-b);
    for(let a=0; a<column.numbers.length; a++){
      const number = {};
      number.number = column.numbers[a];
      number.position = column.positions[a];
      number.column = columnIndex;
      ticket.numbers.push(number);
      ticket.rows[column.positions[a]].push(number);
    }
  });
  return ticket;
}
function makeDomTicket(entry){
  const body = document.createElement('div');
  body.classList.add('ticket-body');
  for(let a=0;a<9;a++){
    const column = document.createElement('div');
    column.classList.add('ticket-column');
    for(let b=0; b<3; b++){
      let matched = false;
      const square = document.createElement('div');
      square.classList.add('square');
      entry.numbers.forEach(function(number){
        if(number.column===a && number.position===b){
          square.classList.add('full');
          square.innerText=number.number;
          matched=!matched;
        }
      });
      if(!matched) {
        square.classList.add('empty');
      }
      column.appendChild(square);
    }
    body.appendChild(column);
  }
  return body;
}
document.addEventListener('DOMContentLoaded', function(){
  const domTicket = document.querySelector('.ticket');
  let analyzed = makeTicket();
  let newTicket = makeDomTicket(analyzed);
  const button = document.querySelector('.button');
  domTicket.appendChild(newTicket);
  ticketSelector = document.querySelector('.ticket-body');
  button.addEventListener('click', function(){
    ticketSelector.remove();
    analyzed = makeTicket();
    newTicket = makeDomTicket(analyzed);
    domTicket.appendChild(newTicket);
    ticketSelector = document.querySelector('.ticket-body');
  });
});
