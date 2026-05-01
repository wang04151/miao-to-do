import './App.css'

const tasks = [
  {
    name: '背单词',
    time: '30分钟',
    reward: '+20',
    status: '已完成',
    icon: '📗',
  },
  {
    name: '写报告',
    time: '45分钟',
    reward: '+30',
    status: '进行中',
    icon: '📄',
  },
  {
    name: '运动',
    time: '20分钟',
    reward: '+15',
    status: '待开始',
    icon: '👟',
  },
  {
    name: '阅读',
    time: '30分钟',
    reward: '+15',
    status: '待开始',
    icon: '📖',
  },
]

function App() {
  return (
    <div className="app">
      <div className="phone">
        <header className="header">
          <div>
            <p className="greeting">早安，今天也一起加油 ☀️</p>
            <h1>喵待办 🐾</h1>
          </div>

          <div className="coin-box">🐟 小鱼干 128</div>
        </header>

        <section className="progress-card">
          <div className="progress-icon">📋</div>

          <div className="progress-info">
            <h2>
              今日任务 <span>3</span>/5
            </h2>

            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>

            <p>继续加油，奖励小鱼干和猫咪爱心哦！</p>
          </div>
        </section>

        <section className="quick-actions">
          <button className="action green">
            <span>🎯</span>
            <b>开始专注</b>
            <small>沉浸专注时光</small>
          </button>

          <button className="action yellow">
            <span>＋</span>
            <b>添加任务</b>
            <small>规划今天的事</small>
          </button>

          <button className="action pink">
            <span>🐟</span>
            <b>喂猫</b>
            <small>投喂小鱼干</small>
          </button>
        </section>

        <section className="content-grid">
          <div className="task-card">
            <div className="card-title">
              <h3>任务清单</h3>
              <p>全部任务 ›</p>
            </div>

            {tasks.map((task, index) => (
              <div className="task-row" key={task.name}>
                <div className={index < 2 ? 'circle checked' : 'circle'}>
                  {index < 2 ? '✓' : ''}
                </div>

                <div className="task-icon">{task.icon}</div>

                <div className="task-text">
                  <b>{task.name}</b>
                  <small>
                    {task.time} · 🐟 {task.reward}
                  </small>
                </div>

                <div
                  className={
                    task.status === '已完成'
                      ? 'tag done'
                      : task.status === '进行中'
                        ? 'tag doing'
                        : 'tag'
                  }
                >
                  {task.status}
                </div>
              </div>
            ))}

            <div className="small-tip">
              💡 完成任务可获得小鱼干，用来照顾猫咪哦～
            </div>
          </div>

          <div className="cat-status-card">
            <div className="card-title">
              <h3>我的小猫</h3>
              <p>Lv.6</p>
            </div>

            <div className="status-item">
              <div>
                <b>🍚 饱食度</b>
                <span>75%</span>
              </div>
              <div className="status-bar">
                <i style={{ width: '75%' }}></i>
              </div>
            </div>

            <div className="status-item">
              <div>
                <b>🫧 清洁度</b>
                <span>80%</span>
              </div>
              <div className="status-bar">
                <i style={{ width: '80%' }}></i>
              </div>
            </div>

            <div className="status-item">
              <div>
                <b>💗 亲密度</b>
                <span>85%</span>
              </div>
              <div className="status-bar">
                <i className="pink-bar" style={{ width: '85%' }}></i>
              </div>
            </div>

            <p className="cat-mood">好棒！小猫今天心情很好～ ✨</p>
          </div>
        </section>

        <section className="cat-scene">
          <div className="speech-bubble">今天也要陪你完成任务喵～</div>

          <div className="cat">
            <div className="ear ear-left"></div>
            <div className="ear ear-right"></div>

            <div className="cat-face">
              <div className="eye eye-left"></div>
              <div className="eye eye-right"></div>
              <div className="nose"></div>
              <div className="mouth">ω</div>
            </div>

            <div className="cat-body"></div>
            <div className="cat-tail"></div>
            <div className="bell">🔔</div>
          </div>
        </section>

        <nav className="bottom-nav">
          <div className="active">🏠<span>首页</span></div>
          <div>📋<span>任务</span></div>
          <div>⏱<span>专注</span></div>
          <div>🐱<span>小猫</span></div>
          <div>🛍<span>商店</span></div>
        </nav>
      </div>
    </div>
  )
}

export default App