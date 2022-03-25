import React from 'react';
import { useTranslation } from 'react-i18next';
import "./upload-cv.scss";

function ThanksPage(props) {
    const { t } = useTranslation();

    return (
        <div className="thanks-page">
            <h1>{t("thanks_for_applying")}</h1>
            <h5>{t("remind_user_check_mail")}</h5>
        </div>
    );
}

export default ThanksPage;