package controllers

import (
	"github.com/qiniu/api.v7/auth/qbox"

	"lizhi/models"

	"github.com/qiniu/api.v7/storage"

	"github.com/astaxie/beego"
)

// TokenController Operations about Token
type TokenController struct {
	beego.Controller
}

// @Title Get
// @Description get qiniu token
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.User
// @Failure 403 :uid is empty
// @router / [get]
func (t *TokenController) Get() {
	putPolicy := storage.PutPolicy{
		Scope: models.BUCKET,
	}
	mac := qbox.NewMac(models.ACCESSKEY, models.SECRETKEY)
	upToken := putPolicy.UploadToken(mac)
	result := make(map[string]string)
	if upToken != "" {
		result["token"] = upToken
		result["bucket"] = models.BUCKET
		t.Data["json"] = result
	}
	t.ServeJSON()
}
