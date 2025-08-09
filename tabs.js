$(document).ready(function () {
  $('.tab').click(function () {
    const selectedTab = $(this).data('tab');

    $('.tab').removeClass('text-blue-600 border-b-2 border-blue-600 active-tab');

    $(this).addClass('text-blue-600 border-b-2 border-blue-600 active-tab');

    $('.tab-content').addClass('hidden');

    $('#tab-' + selectedTab).removeClass('hidden');
  });
});
