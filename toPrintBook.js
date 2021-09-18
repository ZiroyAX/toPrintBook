function createFullPages(counter) {
  const arr = [];
  for (let i = 1; i <= counter; i++) {
    arr.push(i);
  }
  return arr
}

function splitArrOnBeam(elementaryArr = [], desiredQuantitySheets) {
  const counterPagesInBeam = desiredQuantitySheets * 2;
  const splitArrOnBeam = [];
  for (let i = 0; i < elementaryArr.length; i += counterPagesInBeam * 2) {
    splitArrOnBeam.push(elementaryArr.slice(i, i + counterPagesInBeam * 2));
  }
  return splitArrOnBeam
}

function sortOnSide(a, b, addEmptyPage) {
  const even = [];
  const odd = [];

  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if ((i + 1) % 2 !== 0) {
      odd.push(b[i]);
      odd.push(a[i]);
    } else if ((i + 1) % 2 === 0) {
      even.push(b[i]);
      even.push(a[i]);
    }
  }
  // if (b.length > 2 || a.length > 2) {
  //   even.reverse();
  // }

  if (addEmptyPage) {
    even.reverse();
  } else {
    if (!b.includes('Пустая страница')) {
      even.reverse();
    }
  }
  return [odd, even]
}

function splitOnSide(item = [], addEmptyPage) {
  const length = item.length;
  const data_1 = item.slice(0, length / 2);
  const data_2 = item.slice(length / 2);
  if (length === 2) {
    return [[...data_1, 'Пустая страница'], [...data_2, 'Пустая страница'].reverse()]
  } else if (length % 2 !== 0 && addEmptyPage) {
    return [item.slice(0, Math.ceil(length / 2)), [...item.slice(Math.ceil(length / 2)), 'Пустая страница'].reverse()]
  } else return [data_1, data_2.reverse()]
}

function TwoPagesOnSheet(counterAllPages, desiredQuantitySheets, addEmptyPage = false) {
  let elementaryArr;
  if (addEmptyPage) {
    elementaryArr = ['Пустая страница','Пустая страница', ...createFullPages(counterAllPages),'Пустая страница','Пустая страница'];
  } else elementaryArr =  createFullPages(counterAllPages);
  const splitElementaryArrOnBeam = splitArrOnBeam(elementaryArr, desiredQuantitySheets);
  const splitFullOnSide = splitElementaryArrOnBeam.map((item) => {
    return splitOnSide(item)
  });
  const sortFullOnSide = splitFullOnSide.map(([a, b]) => {
    return sortOnSide(a, b)
  });

  let lastItem;
  if (addEmptyPage) {
    lastItem = sortFullOnSide[sortFullOnSide.length - 1]
      .reduce((sum, i) => sum.concat(i), [])
      .filter(Number)
      .sort((a, b) => a > b ? 1 : -1);
    lastItem.push('Пустая страница');
    lastItem.push('Пустая страница');
  } else {
    lastItem = sortFullOnSide[sortFullOnSide.length - 1]
      .reduce((sum, i) => sum.concat(i), [])
      .filter((i) => i !== 'Пустая страница')
      .sort((a, b) => a > b ? 1 : -1);
  }
  const splitFullLastItem = splitOnSide(lastItem, addEmptyPage);
  const sortFullLastitem = sortOnSide(splitFullLastItem[0], splitFullLastItem[1], addEmptyPage);
  // console.log(sortFullOnSide);
  // console.log(lastItem);
  // console.log(splitFullLastItem);
  // console.log(sortFullLastitem);

  sortFullOnSide[sortFullOnSide.length - 1] = sortFullLastitem.map((i) => {
    return i.map((item) => {
      if (item === undefined) {
        return 'Пустая страница'
      } else return item
    })
  });

  return sortFullOnSide.map(([a, b]) => {
    return [a.join(','), b.join(',')]
  })
}

console.log(TwoPagesOnSheet(85, 5));

module.exports.TwoPagesOnSheet = TwoPagesOnSheet;