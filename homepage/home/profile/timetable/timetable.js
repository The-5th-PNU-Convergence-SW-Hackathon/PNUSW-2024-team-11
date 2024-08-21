$(document).ready(() => {
    const $timetable = $('#timetable');
    let isMouseDown = false;
    let isChecked = false; // 마우스를 처음 눌렀을 때의 체크 상태
    let wasDragged = false; // 드래그 여부를 확인하기 위한 플래그
  
    // 타임테이블 생성
    for (let i = 1; i <= 7; i++) {
      const $tableRow = $(`<div class="tableRow${i}"></div>`);
  
      for (let j = 1; j <= 12; j++) {
        const $tableCol = $(`
          <div class="table-box">
            <input type="checkbox" id="checkbox${i}-${j}">
            <label for="checkbox${i}-${j}"></label>
          </div>
        `);
  
        $tableRow.append($tableCol);
      }
  
      $timetable.append($tableRow);
    }
  
    // 체크박스 드래그 및 클릭 기능
    $timetable.on('mousedown', 'label', function(e) {
      e.preventDefault(); // 기본 동작 방지
      isMouseDown = true;
      wasDragged = false;
      const $checkbox = $(this).prev('input[type="checkbox"]');
      isChecked = !$checkbox.prop('checked'); // 현재 상태의 반대로 변경
      $checkbox.prop('checked', isChecked); // 현재 체크박스 상태 변경
    });
  
    $timetable.on('mouseover', 'label', function(e) {
      if (isMouseDown) {
        wasDragged = true;
        const $checkbox = $(this).prev('input[type="checkbox"]');
        $checkbox.prop('checked', isChecked);
      }
    });
  
    // 클릭 후 드래그 없이 마우스 업일 때 체크 상태를 유지
    $timetable.on('mouseup', 'label', function(e) {
      if (!wasDragged) {
        const $checkbox = $(this).prev('input[type="checkbox"]');
        $checkbox.prop('checked', !$checkbox.prop('checked')); // 체크 상태를 반전시킴
      }
      isMouseDown = false;
    });
  
    // 문서 전체에서 마우스 업 이벤트 핸들러
    $(document).on('mouseup', () => {
      isMouseDown = false;
    });
  });