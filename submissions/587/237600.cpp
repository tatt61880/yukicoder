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
	string S;
	cin >> S;

	map<char, int> m;
	rep(i, S.size()){
		m[S[i]]++;
	}
	int count = 0;
	for(auto x: m){
		if(x.second > 2){
			cout << "Impossible" << endl;
			return 0;
		}
		count++;
	}
	if(count != 7){
		cout << "Impossible" << endl;
		return 0;
	}
	for(auto x: m){
		if(x.second == 1){
			cout << x.first << endl;
		}
	}
	return 0;
}
