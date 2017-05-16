(function () {
  'use strict'

  let header =
  `<nav>
    <ul>
      <li>
        <input id="menu__toggle" class="menu__toggle" type="checkbox">
        <label id="menu__toggle-label" for="menu__toggle">
          <span>toggle menu</span>
        </label>
        <nav id="menu__nav">
          <p style="color: #fff; padding: .5em; margin: 0;">新闻分类</p>
          <div>
          <form>
            <ul>
              <li>
                <input id="deleted" type="checkbox" name="deleted" value="true"></input>
                <label for="deleted">不感兴趣</label>
              </li>
              <li><h4>报纸类别</h4>
                <ul>
                  <li>
                    <input id="pressCentral" type="radio" name="press" value="pressCentral"></input>
                    <label for="pressCentral">中央一级党报</label>
                  </li>
                  <li>
                    <input id="pressProvincial" type="radio" name="press" value="pressProvincial"></input>
                    <label for="pressProvincial">省一级党报</label>
                  </li>
                  <li>
                    <input id="pressUrban" type="radio" name="press" value="pressUrban"></input>
                    <label for="pressUrban">都市类党报</label>
                  </li>
                </ul>
              </li>
              <li><h4>新闻类型</h4>
                <ul>
                  <li>
                    <input id="typePure" type="radio" name="type" value="typePure"></input>
                    <label for="typePure">纯净新闻</label>
                  </li>
                  <li>
                    <input id="typeFeature" type="radio" name="type" value="typeFeature"></input>
                    <label for="typeFeature">特稿与特写</label>
                  </li>
                  <li>
                    <input id="typeCommentary" type="radio" name="type" value="typeCommentary"></input>
                    <label for="typeCommentary">评论</label>
                  </li>
                  <li>
                    <input id="typeMisc" type="radio" name="type" value="typeMisc"></input>
                    <label for="typeMisc">其他</label>
                  </li>
                </ul>
              </li>
              <li><h4>报道主题</h4>
                <ul>
                  <li>
                      <input id="topicHelp" type="radio" name="topic" value="topicHelp"></input>
                      <label for="topicHelp">社会各界帮助关爱</label>
                    <ul id="topicHelpSub">
                      <li>种类
                        <ul>
                          <li>
                            <input id="topicHelpDonation" type="radio" name="topicHelp" value="topicHelpDonation"></input>
                            <label for="topicHelpDonation">单纯一次捐款捐物</label>
                          </li>
                          <li>
                            <input id="topicHelpTravel" type="radio" name="topicHelp" value="topicHelpTravel"></input>
                            <label for="topicHelpTravel">旅游活动安排</label>
                          </li>
                          <li>
                            <input id="topicHelpFree" type="radio" name="topicHelp" value="topicHelpFree"></input>
                            <label for="topicHelpFree">免费开放</label>
                          </li>
                          <li>
                            <input id="topicHelpFunding" type="radio" name="topicHelp" value="topicHelpFunding"></input>
                            <label for="topicHelpFunding">设立长期资助项目</label>
                          </li>
                          <li>
                            <input id="topicHelpMisc" type="radio" name="topicHelp" value="topicHelpMisc"></input>
                            <label for="topicHelpMisc">其他</label>
                          </li>
                        </ul>
                      </li>
                      <li>主体
                        <ul>
                          <li>
                            <input id="topicHelpByGovernment" type="radio" name="topicHelpBy" value="topicHelpByGovernment"></input>
                            <label for="topicHelpByGovernment">政府</label>
                          </li>
                          <li>
                            <input id="topicHelpByEnterprise" type="radio" name="topicHelpBy" value="topicHelpByEnterprise"></input>
                            <label for="topicHelpByEnterprise">企业</label>
                          </li>
                          <li>
                            <input id="topicHelpByInstitution" type="radio" name="topicHelpBy" value="topicHelpByInstitution"></input>
                            <label for="topicHelpByInstitution">事业单位</label>
                          </li>
                          <li>
                            <input id="topicHelpByCharity" type="radio" name="topicHelpBy" value="topicHelpByCharity"></input>
                            <label for="topicHelpByCharity">公益团体</label>
                          </li>
                          <li>
                            <input id="topicHelpByPersonal" type="radio" name="topicHelpBy" value="topicHelpByPersonal"></input>
                            <label for="topicHelpByPersonal">个人</label>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <input id="topicOpinion" type="radio" name="topic" value="topicOpinion"></input>
                    <label for="topicOpinion">社会各界看法及建议</label>
                  </li>
                  <li>
                    <input id="topicCommend" type="radio" name="topic" value="topicCommend"></input>
                    <label for="topicCommend">表彰单位或个人</label>
                    <ul id="topicCommendSub">
                      <li>
                        <input id="topicCommendGovernment" type="radio" name="topicCommend" value="topicCommendGovernment"></input>
                        <label for="topicCommendGovernment">政府</label>
                      </li>
                      <li>
                        <input id="topicCommendEnterprise" type="radio" name="topicCommend" value="topicCommendEnterprise"></input>
                        <label for="topicCommendEnterprise">企业</label>
                      </li>
                      <li>
                        <input id="topicCommendInstitution" type="radio" name="topicCommend" value="topicCommendInstitution"></input>
                        <label for="topicCommendInstitution">事业单位</label>
                      </li>
                      <li>
                        <input id="topicCommendCharity" type="radio" name="topicCommend" value="topicCommendCharity"></input>
                        <label for="topicCommendCharity">公益团体</label>
                      </li>
                      <li>
                        <input id="topicCommendPersonal" type="radio" name="topicCommend" value="topicCommendPersonal"></input>
                        <label for="topicCommendPersonal">个人</label>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <input id="topicViolence" type="radio" name="topic" value="topicViolence"></input>
                    <label for="topicViolence">留守儿童遭受暴力</label>
                    <ul id="topicViolenceSub">
                      <li>
                        <input id="topicViolenceMale" type="radio" name="topicViolence" value="topicViolenceMale"></input>
                        <label for="topicViolenceMale">男</label>
                      </li>
                      <li>
                        <input id="topicViolenceFemale" type="radio" name="topicViolence" value="topicViolenceFemale"></input>
                        <label for="topicViolenceFemale">女</label>
                      </li>
                      <li>
                        <input id="topicViolenceUnknown" type="radio" name="topicViolence" value="topicViolenceUnknown"></input>
                        <label for="topicViolenceUnknown">未提及</label>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <input id="topicSex" type="radio" name="topic" value="topicSex"></input>
                    <label for="topicSex">留守儿童遭受性侵犯</label>
                    <ul id="topicSexSub">
                      <li>
                        <input id="topicSexMale" type="radio" name="topicSex" value="topicSexMale"></input>
                        <label for="topicSexMale">男</label>
                      </li>
                      <li>
                        <input id="topicSexFemale" type="radio" name="topicSex" value="topicSexFemale"></input>
                        <label for="topicSexFemale">女</label>
                      </li>
                      <li>
                        <input id="topicSexUnknown" type="radio" name="topicSex" value="topicSexUnknown"></input>
                        <label for="topicSexUnknown">未提及</label>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <input id="topicCriminal" type="radio" name="topic" value="topicCriminal"></input>
                    <label for="topicCriminal">留守儿童犯罪</label>
                  </li>
                  <li>
                    <input id="topicDeath" type="radio" name="topic" value="topicDeath"></input>
                    <label for="topicDeath">留守儿童意外死亡</label>
                    <ul id="topicDeathSub">
                      <li>
                        <input id="topicDeadthMale" type="radio" name="topicDeadth" value="topicDeadthMale"></input>
                        <label for="topicDeadthMale">男</label>
                      </li>
                      <li>
                        <input id="topicDeadthFemale" type="radio" name="topicDeadth" value="topicDeadthFemale"></input>
                        <label for="topicDeadthFemale">女</label>
                      </li>
                      <li>
                        <input id="topicDeadthUnknown" type="radio" name="topicDeadth" value="topicDeadthUnknown"></input>
                        <label for="topicDeadthUnknown">未提及</label>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <input id="topicPositive" type="radio" name="topic" value="topicPositive"></input>
                    <label for="topicPositive">留守儿童努力上进</label>
                  </li>
                  <li>
                    <input id="topicParents" type="radio" name="topic" value="topicParents"></input>
                    <label for="topicParents">父母打工艰难生活</label>
                  </li>
                  <li>
                    <input id="topicMisc" type="radio" name="topic" value="topicMisc"></input>
                    <label for="topicMisc">其他</label>
                  </li>
                </ul>
              </li>
              <li><h4>新闻报道消息来源</h4>
                <ul>
                  <li>
                    <input id="srcJournalist" type="radio" name="src" value="srcJournalist"></input>
                    <label for="srcJournalist">记者</label>
                  </li>
                  <li>
                    <input id="srcGovernment" type="radio" name="src" value="srcGovernment"></input>
                    <label for="srcGovernment">政府</label>
                  </li>
                  <li>
                    <input id="srcEnterprise" type="radio" name="src" value="srcEnterprise"></input>
                    <label for="srcEnterprise">企业</label>
                  </li>
                  <li>
                    <input id="srcInstitution" type="radio" name="src" value="srcInstitution"></input>
                    <label for="srcInstitution">事业单位</label>
                  </li>
                  <li>
                    <input id="srcCharity" type="radio" name="src" value="srcCharity"></input>
                    <label for="srcCharity">公益团体</label>
                  </li>
                  <li>
                    <input id="srcExpert" type="radio" name="src" value="srcExpert"></input>
                    <label for="srcExpert">专家学者</label>
                  </li>
                  <li>
                    <input id="srcLeader" type="radio" name="src" value="srcLeader"></input>
                    <label for="srcLeader">领导, 政协或人大代表</label>
                  </li>
                  <li>
                    <input id="srcMisc" type="radio" name="src" value="srcMisc"></input>
                    <label for="srcMisc">其他</label>
                  </li>
                </ul>
              </li>
              <li><h4>媒介形象呈现</h4>
                <ul>
                  <li>
                    <input id="pubimgPositive" type="radio" name="pubimg" value="pubimgPositive"></input>
                    <label for="pubimgPositive">积极健康</label>
                    <ul id="pubimgPositiveSub">
                      <li>
                        <input id="pubimgPositiveMale" type="radio" name="pubimgPositive" value="pubimgPositiveMale"></input>
                        <label for="pubimgPositiveMale">男</label>
                      </li>
                      <li>
                        <input id="pubimgPositiveFemale" type="radio" name="pubimgPositive" value="pubimgPositiveFemale"></input>
                        <label for="pubimgPositiveFemale">女</label>
                      </li>
                      <li>
                        <input id="pubimgPositiveUnknown" type="radio" name="pubimgPositive" value="pubimgPositiveUnknown"></input>
                        <label for="pubimgPositiveUnknown">未提及</label>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <input id="pubimgMiserable" type="radio" name="pubimg" value="pubimgMiserable"></input>
                    <label for="pubimgMiserable">可怜悲惨</label>
                  </li>
                  <li>
                    <input id="pubimgHappy" type="radio" name="pubimg" value="pubimgHappy"></input>
                    <label for="pubimgHappy">沐恩幸福</label>
                  </li>
                  <li>
                    <input id="pubimgProblematic" type="radio" name="pubimg" value="pubimgProblematic"></input>
                    <label for="pubimgProblematic">问题儿童</label>
                  </li>
                  <li>
                    <input id="pubimgMisc" type="radio" name="pubimg" value="pubimgMisc"></input>
                    <label for="pubimgMisc">其他</label>
                  </li>
                </ul
              </li>
              <li><h4>留守儿童不能在城市读书原因</h4>
                <ul>
                  <li>
                    <input id="eduRegister" type="checkbox" name="edu" value="eduRegister"></input>
                    <label for="eduRegister">无本地户籍难入公立学校</label>
                  </li>
                  <li>
                    <input id="eduFee" type="checkbox" name="edu" value="eduFee"></input>
                    <label for="eduFee">私立学校学费高</label>
                  </li>
                  <li>
                    <input id="eduQuality" type="checkbox" name="edu" value="eduQuality"></input>
                    <label for="eduQuality">私立学校教学质量没保障</label>
                  </li>
                  <li>
                    <input id="eduQualification" type="checkbox" name="edu" value="eduQualification"></input>
                    <label for="eduQualification">越来越多私立学校被国家取消办学资格</label>
                  </li>
                  <li>
                    <input id="eduMisc" type="checkbox" name="edu" value="eduMisc"></input>
                    <label for="eduMisc">其他</label>
                  </li>
                </ul
              </li>
            </ul>
          </form>
          </div>
          <button id="submitTags" type="button" style="width: 100%; text-align: center; font-size: .8em;">确定</button>
        </nav>
      </li>
      <li id="logo"><a href="index.html">lbcFeed</a></li>
      <li>
        <a id="stats-link" href="stats.html">
          <button type="button"><span>stats</span></button>
        </a>
      </li>
    </ul>
  </nav>`

  render('header', header)
})()
