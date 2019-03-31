//{{{
#include <bits/stdc++.h>
using namespace std;
#define rep(...) repN((__VA_ARGS__,rep3,rep2,loop,~))(__VA_ARGS__)
#define loop(n) rep2(_loop_,n)
#define rep2(i,n) rep3(i,0,n)
#define rep3(i,begin,end) for(int i=(int)(begin),i##_end=(int)(end);i<i##_end;++i)
#define repN(a) repX a
#define repX(a0,a1,a2,x,...) x
typedef long long ll;
const int MOD = 1e9+7;
//}}}

int main(){
	int N;
	cin >> N;

	map<string, int> m;
	rep(i, N){
		int No, M, S;
		cin >> No >> M >> S;
		rep(j, M){
			string tag;
			cin >> tag;
			m[tag] += S;
		}
	}
	vector<pair<int, string>> v;
	for(auto x: m) v.emplace_back(-x.second, x.first);
	sort(v.begin(), v.end());
	int num = 0;
	for(auto x: v){
		if(num++ < 10){
			cout << x.second << " " << -x.first << endl;
		}
	}
	return 0;
}
