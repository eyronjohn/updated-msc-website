$(document).ready(function () {
  $('.tab').click(function () {
    const selectedTab = $(this).data('tab');

    $('.tab').removeClass('text-[#b9da05] border-b-2 border-[#b9da05] active-tab');

    $(this).addClass('text-[#b9da05] border-b-2 border-[#b9da05] active-tab');

    $('.tab-content').addClass('hidden');

    $('#tab-' + selectedTab).removeClass('hidden');
  });
});
