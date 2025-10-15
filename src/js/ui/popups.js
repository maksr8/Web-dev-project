function openPopup(popup) {
    popup.classList.remove('hidden');
}

function closePopup(popup) {
    popup.classList.add('hidden');
}

function handlePopupClick(e) {
    const closeBtn = e.target.closest('.close');
    if (closeBtn) {
        const popup = closeBtn.closest('.popup');
        closePopup(popup);
    }
}

export { openPopup, closePopup, handlePopupClick };
